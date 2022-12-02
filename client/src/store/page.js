/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict'
import { Fetch } from './index'

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
    set(state, page) {
      state.page = page
    },
  },
  actions: {
    async get({ commit, rootState }, name) {
      const resp = await Fetch.get(
        `${rootState.origin}/api/page/${encodeURIComponent(name)}`
      )
      if (resp.status !== 200) {
        const err = new Error('fetch page failed')
        err.res = resp
        throw err
      }

      const page = await resp.json()
      commit('set', page)
      return page
    },
  },
}
