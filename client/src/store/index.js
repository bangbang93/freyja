/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
import Vuex from 'vuex'
import VueFetch from 'vue-fetch'
import ArticleStore from './article'
import CommentStore from './comment'
import HomeStore from './home'

export const Fetch = VueFetch({logging: true})


export function createStore (){
  return new Vuex.Store({
    state: {
      markdownConfig: {
        html: true,        // Enable HTML tags in source
        xhtmlOut: true,        // Use '/' to close single tags (<br />).
        breaks: true,        // Convert '\n' in paragraphs into <br>
        langPrefix: 'language-markdown',  // CSS language prefix for fenced blocks. Can be
        linkify: false,        // 自动识别url
        typographer: true,
        quotes: '“”‘’',
        highlight: function (str, lang) {
          return '<pre class="hljs"><code class="' + lang + '">' + markdown.utils.escapeHtml(str) + '</code></pre>';
        }
      },
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
    }
  })  
}
