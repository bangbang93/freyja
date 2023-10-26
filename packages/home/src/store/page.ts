/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict'

import {defineStore} from 'pinia'
import {Fetch} from '../utils/fetch'
import {useRootStore} from './index.ts'

export interface IPageState {
  page: {
    title: string
    content: string
    html: string
    name: string
    author: {
      username: string
    }
    createdAt: string
  }
}

export const usePageStore = defineStore('page', {
  state: (): IPageState => ({
    page: {
      title: '',
      content: '',
      html: '',
      name: '',
      author: {
        username: '',
      },
      createdAt: '',
    },
  }),
  actions: {
    async get(name: string) {
      const rootState = useRootStore()
      const resp = await Fetch.get(
        `${rootState.origin}/api/page/${encodeURIComponent(name)}`,
      )
      if (resp.status !== 200) {
        throw new Error('fetch page failed')
      }

      this.page = await resp.json() as IPageState['page']
      return this.page
    },
  },
})
