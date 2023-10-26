/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict'
import {Fetch, useRootStore} from './index.ts'

export default {
  namespaced: true,
  state: () => ({
    articles: [
      {
        _id: '0',
        title: '',
        summary: '',
        tags: [],
        author: {
          username: '',
        },
        createdAt: '',
        commentCount: 0,
      },
    ],
    categories: [],
  }),
  getters: {
    articleCount(state) {
      return state.articles.length
    },
  },
  mutations: {
    setArticles(state, list) {
      state.articles.length = 0
      state.articles.push(...list)
    },
    addPage(state, page) {
      state.page += page
    },
    setCategories(state, categories) {
      state.categories.splice(0, state.categories.length)
      categories.forEach((e) => {
        state.categories.push(e)
      })
    },
  },
  actions: {
    async getArticles({commit}, {page, tag, category}) {
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
        const err = new Error('fetch article list failed')
        err.resp = resp
        err.status = resp.status
        throw err
      }

      const list = await resp.json()
      commit('setArticles', list)
      return list
    },
    async getCategories({commit}) {
      const resp = await Fetch.get('/api/category/tree')
      const categories = await resp.json()
      commit('setCategories', categories)
    },
    async search({commit, rootState}, {keyword, page}) {
      const resp = await Fetch.get(`${rootState.origin}/api/article/search`, {
        keyword,
        page,
      })
      const articles = await resp.json()
      commit('setArticles', articles)
    },
  },
}
