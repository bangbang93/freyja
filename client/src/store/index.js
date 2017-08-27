/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
import Vuex from 'vuex'
import VueFetch from 'vue-fetch'

const Fetch = VueFetch({logging: true})


export function createStore (){
  return new Vuex.Store({
    state: {
      oni: 'adfsdfa'
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
    }
  })  
}
