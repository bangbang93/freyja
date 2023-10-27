/**
 * Created by bangbang93 on 2017/9/6.
 */
'use strict'

import {defineStore} from 'pinia'
import {Fetch} from '../utils/fetch'


export interface IComment {
  _id: string
  content: string
  publisher: IPublisher
  replies?: IComment[]
}
export interface IPublisher {
  name: string
  email: string
  website: string
}
export interface ICommentState {
  comments: IComment[]
  publisher: IPublisher
}

export const useCommentStore = defineStore('comment', {
  state: (): ICommentState => {
    let publisher = {
      name: '',
      email: '',
      website: '',
    }
    if (typeof localStorage !== 'undefined') {
      const item = localStorage.getItem('freyja:publisher')
      if (item) {
        publisher = JSON.parse(item) as ICommentState['publisher']
      }
    }
    return {
      comments: [],
      publisher,
    }
  },
  actions: {
    async create(articleId: string, content: string, replyId?: string) {
      const resp = await Fetch.post(`/api/comment/article/${articleId}`, {
        content,
        publisher: this.publisher,
        reply: replyId,
      })
      if (resp.status !== 201) {
        throw new Error('add commit failed')
      }

      const comment = await resp.json() as IComment

      if (replyId) {
        this.reply(replyId, comment)
      } else {
        this.comments.unshift(comment)
      }
      return comment
    },
    async list(articleId: string, page: number) {
      const resp = await Fetch.get(`/api/comment/article/${articleId}`, {
        page,
      })
      if (resp.status !== 200) {
        throw new Error('fetch comments failed')
      }

      this.comments = await resp.json() as IComment[]
      return this.comments
    },
    savePublisher(publisher: ICommentState['publisher']) {
      this.publisher = publisher
      localStorage?.setItem('freyja:publisher', JSON.stringify(publisher))
    },
    reply(replyId: string, newComment: IComment) {
      return walk(this.comments)
      function walk(comments: IComment[]): void {
        for (const comment of comments) {
          if (comment._id === replyId) {
            comment.replies = comment.replies ?? []
            comment.replies.push(newComment)
            return
          }
          if (comment.replies) {
            walk(comment.replies)
          }
        }
      }
    },
  },
})
