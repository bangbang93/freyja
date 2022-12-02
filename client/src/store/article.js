/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict'
import { Fetch } from './index'

export default {
  namespaced: true,
  state: () => ({
    article: {
      _id: '',
      title: '',
      content: '',
      tags: [],
      author: {
        username: '',
      },
      createdAt: '',
    },
  }),
  mutations: {
    set(state, article) {
      state.article = article
    },
  },
  actions: {
    async get({ commit, rootState }, id) {
      const resp = await Fetch.get(`${rootState.origin}/api/article/${id}`)
      if (resp.status !== 200) {
        const err = new Error('fetch article failed')
        err.res = resp
        throw err
      }

      const article = await resp.json()
      commit('set', article)
      return article
    },
  },
}
