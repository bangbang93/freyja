/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import {createStore} from 'vuex'
import VueFetch from 'vue-fetch'
import ArticleStore from './article.js'
import CommentStore from './comment.js'
import HomeStore from './home.js'
import LinkStore from './link.js'
import PageStore from './page.js'

export const Fetch = VueFetch()

export function createRootStore() {
  return createStore({
    state: {
      origin: '',
      ssrReferer: '',
    },
    mutations: {
      updateONI(state, str) {
        state.oni = str
      },
      setReferer(state, referer) {
        Fetch.setDefaultHeader('referer', referer)
        state.ssrReferer = referer
      },
      setOrigin(state, origin) {
        state.origin = origin
      },
    },
    actions: {
      fetchLatest(ctx) {
        return Fetch.get('https://api.bangbang93.com/oxygenbbs/oni-alpha')
          .then((res) => {
            return res.text()
          })
          .then((text) => {
            ctx.commit('updateONI', text)
          })
      },
    },
    modules: {
      article: ArticleStore,
      comment: CommentStore,
      home: HomeStore,
      link: LinkStore,
      page: PageStore,
    },
  })
}
