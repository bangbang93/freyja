/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
import Vuex from 'vuex'
import VueFetch from 'vue-fetch'
import ArticleStore from './article'
import CommentStore from './comment'
import HomeStore from './home'
import LinkStore from './link'

export const Fetch = VueFetch()


export function createStore (){
  return new Vuex.Store({
    state: {
      origin: '',
    },
    mutations: {
      updateONI(state, str) {
        state.oni = str
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
          .catch(console.error);
      }
    },
    modules: {
      article: ArticleStore,
      comment: CommentStore,
      home: HomeStore,
      link: LinkStore,
    }
  })  
}
