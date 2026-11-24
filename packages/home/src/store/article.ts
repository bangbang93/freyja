/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict'

import {defineStore} from 'pinia'
import {render as renderAbort} from 'vike/abort'
import {Fetch} from '../utils/fetch'
import {useRootStore} from './index.ts'

const HTTP_OK = 200
const HTTP_NOT_FOUND = 404

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
      if (resp.status === HTTP_NOT_FOUND) {
        throw renderAbort(HTTP_NOT_FOUND)
      }
      if (resp.status !== HTTP_OK) {
        throw new Error('fetch article failed')
      }

      const article = await resp.json() as IArticleState['article']
      this.article = article
      return article
    },
  },
})
