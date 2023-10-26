/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import {defineStore} from 'pinia'
// @ts-expect-error vuex type error
import {createStore} from 'vuex'
import {Fetch} from '../utils/fetch.ts'
import ArticleStore from './article.js'
import CommentStore from './comment.js'
import LinkStore from './link.js'


export interface State {
  origin: string
  ssrReferer: string
}

export const useRootStore = defineStore('root', {
  state: (): State => ({
    origin: '',
    ssrReferer: '',
  }),
  actions: {
    setReferer(referer: string) {
      Fetch.setDefaultHeader('referer', referer)
      this.ssrReferer = referer
    },
    setOrigin(origin: string) {
      this.origin = origin
    },
  },
})

export function createRootStore() {
  return createStore({
    state: {},
    modules: {
      article: ArticleStore,
      comment: CommentStore,
      link: LinkStore,
    },
  })
}
