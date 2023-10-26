/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import {defineStore} from 'pinia'
import VueFetch from 'vue-fetch'
// @ts-expect-error vuex type error
import {createStore} from 'vuex'
import ArticleStore from './article.js'
import CommentStore from './comment.js'
import LinkStore from './link.js'
import PageStore from './page.js'

export const Fetch = VueFetch()

export interface State {
  origin: string
  ssrReferer: string
  fetch: typeof Fetch
}

export const useRootStore = defineStore('root', {
  state: (): State => ({
    origin: '',
    ssrReferer: '',
    fetch: Fetch,
  }),
  actions: {
    setReferer(referer: string) {
      Fetch.setDefaultHeader('referer', referer)
      this.fetch.setDefaultHeader('referer', referer)
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
      page: PageStore,
    },
  })
}
