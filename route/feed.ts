/**
 * Created by bangbang93 on 2017/9/24.
 */
'use strict';
import Router from 'express-promise-router'
import {FeedService} from '../service/feed.service'

const router = Router()
router.get('/', async (req, res) => {
  const baseUrl = `${req.protocol}://${req.hostname}`
  const rss = await FeedService.getFeed(baseUrl)

  res.type('xml')
  res.send(rss)
})

module.exports = router
