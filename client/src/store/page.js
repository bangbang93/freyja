/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict';
import {Fetch} from './index'

export default {
  namespaced: true,
  state: () => ({
    page: {
      title: '',
      content: '',
      name: '',
      author: {
        username: '',
      },
      createdAt: '',
    },
  }),
  mutations: {
    set (state, page) {
      state.page = page
    },
  },
  actions: {
    async get({commit, rootState}, name) {
      let resp = await Fetch.get(`${rootState.origin}/api/page/${name}`)
      if (resp.status !== 200) {
        throw new Error('fetch article failed')
      }

      const page = await resp.json()
      commit('set', page)
      return page
    },
  }
}
