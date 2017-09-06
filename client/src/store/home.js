/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict';
import {Fetch} from './index'

export default {
  namespaced: true,
  state: {
    articles: [{
      title: '',
      summary: '',
      tags: [],
      author: {
        username: '',
      },
      createdAt: ''
    }],
    page: 1
  },
  mutations: {
    setArticles(state, list) {
      state.articles.splice(0, state.articles.length)
      list.forEach((article) => {
        state.articles.push(article)
      })
    },
    addPage(state, page) {
      state.page += page;
    }
  },
  actions: {
    async getArticles({commit, rootState}, page) {
      let resp = await Fetch.get(`${rootState.origin}/api/article`, {page})
      if (resp.status !== 200) {
        throw new Error('fetch article list failed')
      }

      const list = await resp.json()
      commit('setArticles', list)
      return list
    },
    doPager({commit, dispatch, state}, page) {
      commit('addPage', page)
      return dispatch('getArticles', state.page)
    }
  }
}
