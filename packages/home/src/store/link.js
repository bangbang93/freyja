/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict'
import {Fetch} from './index.js'

export default {
  namespaced: true,
  state: () => ({
    links: [],
  }),
  mutations: {
    setLinks(state, links) {
      state.links.splice(0, state.links.length)
      links.forEach((e) => {
        state.links.push(e)
      })
    },
  },
  actions: {
    async getLinks({commit, rootState}) {
      const resp = await Fetch.get(`${rootState.origin}/api/link`)
      commit('setLinks', await resp.json())
    },
  },
}
