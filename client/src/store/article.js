/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict';
import {Fetch} from './index'

export default {
  namespaced: true,
  state: {
    article: {
      title: '',
      content: '',
      tags: [],
      author: {
        username: '',
      },
      createdAt: ''
    },
  },
  mutations: {
    set (state, article) {
      state.article = article
    },
  },
  actions: {
    async get({commit, rootState}, id) {
      let resp = await Fetch.get(`${rootState.origin}/api/article/${id}`)
      if (resp.status !== 200) {
        throw new Error('fetch article failed')
      }

      const article = await resp.json()
      commit('set', article)
      return article
    },
  }
}
