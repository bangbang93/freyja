/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict';
import {Fetch} from './index'

export default {
  namespaced: true,
  state: {
    comments: []
  },
  mutations: {
    create (state, comment) {
      state.comments.push(comment)
    },
    set (state, comments) {
      state.comments = comments;
    }
  },
  action: {
    async create ({commit}, comment) {
      let resp = await Fetch.post('/api/comment', comment)
      if (resp.status !== 201) {
        let err = new Error('add commit failed')
        err.status = resp.status
        err.body = await resp.json()
        throw err
      }

      comment = await resp.json()

      commit('create', comment)
      return comment
    },
    async list ({commit}, {articleId, page}) {
      let resp = await Fetch.get(`/api/comment/article/${articleId}`, {page})
      if (resp.status !== 200){
        throw new Error('fetch comments failed')
      }

      const comments = await resp.json()

      commit('set', comments)
      return comments
    },
    async reply({dispatch}, {comment, replyCommentId}) {
      comment.reply = replyCommentId
      return dispatch('create', comment)
    }
  }
}
