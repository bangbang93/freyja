/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
const LRU = require('lru-cache')
const ms = require('ms')

const microCache = LRU({
  max: 1000,
  maxAge: ms('30s')
})

const isCacheable = (req) => {
  return req.app.get('env') === 'production'
}


module.exports = function (renderer) {
  return function render (req, res, next) {
    const s = Date.now()

    const handleError = err => {
      const time = Date.now() - s
      res.set('x-ssr-time', time)
      if (err.url) {
        res.redirect(err.url)
      } else if(err.code === 404) {
        next()
      } else {
        // Render Error Page or Redirect
        next(err)
      }
    }

    const cacheable = isCacheable(req)
    if (cacheable) {
      const hit = microCache.get(req.url)
      if (hit) {
        res.set('x-ssr-cache', 'hit')
        res.setHeader("Content-Type", "text/html")
        return res.end(hit)
      }
    }
    res.set('x-ssr-cache', 'miss')

    const origin = `http://localhost:${req.app.get('port')}`

    const context = {
      title: 'Freyja', // default title
      url: req.url,
      origin,
      referer: `${req.protocol}://${req.hostname}${req.url}`,
    }
    renderer.renderToString(context, (err, html) => {
      if (err) {
        return handleError(err)
      }
      if (context.status) {
        res.status(context.status)
      }
      res.setHeader("Content-Type", "text/html")
      if (cacheable) {
        microCache.set(req.url, html)
      }
      const time = Date.now() - s
      if (req.app.get('env') !== 'production') {
        console.log(`whole request: ${time}ms`)
      }
      res.set('x-ssr-time', time)
      res.end(html)
    })
  }
}
