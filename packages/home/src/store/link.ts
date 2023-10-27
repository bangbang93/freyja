/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict'

import {defineStore} from 'pinia'
import {Fetch} from '../utils/fetch'
import {useRootStore} from './index.ts'

export interface ILinkStore {
  links: {
    name: string
    href: string
  }[]
}

export const useLinkStore = defineStore('link', {
  state: (): ILinkStore => ({
    links: [],
  }),
  actions: {
    async getLinks() {
      const rootState = useRootStore()
      const resp = await Fetch.get(`${rootState.origin}/api/link`)
      this.links = await resp.json() as ILinkStore['links']
    },
  },
})

