/**
 * Created by bangbang93 on 2017/9/24.
 */
'use strict';
const router = require('express-promise-router')()
const FeedService = require('../service/feed')

router.get('/', async function (req, res) {
  const baseUrl = `${req.protocol}://${req.hostname}`
  const rss = await FeedService.getFeed(baseUrl)

  res.type('xml')
  res.send(rss)
})

module.exports = router
