/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict'

import {defineStore} from 'pinia'
import {Fetch} from '../utils/fetch'
import {useRootStore} from './index.ts'

interface IArticleState {
  article: {
    _id: string
    title: string
    content: string
    html: string
    tags: string[]
    author: {
      username: string
    }
    createdAt: string
  }
}

export const useArticleStore = defineStore('article', {
  state: (): IArticleState => ({
    article: {
      _id: '',
      title: '',
      content: '',
      html: '',
      tags: [],
      author: {
        username: '',
      },
      createdAt: '',
    },
  }),
  actions: {
    async get(id: string) {
      const rootState = useRootStore()
      const resp = await Fetch.get(`${rootState.origin}/api/article/${id}`)
      if (resp.status !== 200) {
        throw new Error('fetch article failed')
      }

      const article = await resp.json() as IArticleState['article']
      this.article = article
      return article
    },
  },
})
