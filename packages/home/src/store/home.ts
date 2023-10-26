/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict'
import {defineStore} from 'pinia'
import {Fetch} from '../utils/fetch.js'
import {useRootStore} from './index.ts'

export interface HomeState {
  articles: {
    _id: string
    title: string
    summary: string
    tags: string[]
    author: {
      username: string
    }
    createdAt: string
    commentCount: number
  }[]
  categories: []
}

interface IGetArticleParams {
  page: number
  tag?: string
  category?: string
}

interface ISearchParams {
  keyword: string
  page: number
}

export const useHomeStore = defineStore('home', {
  state: (): HomeState => ({
    articles: [],
    categories: [],
  }),
  actions: {
    async getArticles({page, tag, category}: IGetArticleParams) {
      const rootState = useRootStore()
      let resp
      if (tag) {
        resp = await Fetch.get(
          `${rootState.origin}/api/tag/${encodeURIComponent(tag)}`,
          {page},
        )
      } else if (category) {
        resp = await Fetch.get(
          `${rootState.origin}/api/category/${encodeURIComponent(category)}`,
          {page},
        )
      } else {
        resp = await Fetch.get(`${rootState.origin}/api/article`, {page})
      }
      if (resp.status !== 200) {
        throw new Error('fetch article list failed')
      }

      const list = await resp.json() as HomeState['articles']
      this.articles = list
      return list
    },
    async getCategories() {
      const resp = await Fetch.get('/api/category/tree')
      this.categories = await resp.json() as HomeState['categories']
    },
    async search({keyword, page}: ISearchParams) {
      const rootState = useRootStore()
      const resp = await Fetch.get(`${rootState.origin}/api/article/search`, {
        keyword,
        page,
      })
      this.articles = await resp.json() as HomeState['articles']
    },
  },
})
