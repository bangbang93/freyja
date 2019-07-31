import {Middleware} from 'express-validator/src/base'
import * as LRU from 'lru-cache'
import ms = require('ms')
import {BundleRenderer} from 'vue-server-renderer'

const microCache = new LRU({
  max   : 1000,
  maxAge: ms('30s'),
})

const isCacheable = (req) => {
  return req.app.get('env') === 'production'
}

export default function (renderer: BundleRenderer): Middleware {
  return function render(req, res, next) {
    const s = Date.now()

    const handleError = (err) => {
      const time = Date.now() - s
      res.set('x-ssr-time', time)
      if (err.url) {
        res.redirect(err.url)
      } else if (err.code === 404) {
        return next()
      } else {
        // Render Error Page or Redirect
        return next(err)
      }
    }

    const cacheable = isCacheable(req)
    if (cacheable) {
      const hit = microCache.get(req.url)
      if (hit) {
        res.set('x-ssr-cache', 'hit')
        res.set('content-type', 'text/html')
        return res.end(hit)
      }
    }
    res.set('x-ssr-cache', 'miss')

    const origin = `http://localhost:${req.app.get('port')}`

    const context = {
      title  : 'Freyja', // default title
      url    : req.url,
      origin,
      referer: `${req.protocol}://${req.hostname}${req.url}`,
      status : null,
    }
    renderer.renderToString(context, (err, html) => {
      if (err) {
        return handleError(err)
      }
      if (context.status) {
        res.status(context.status)
      }
      res.set('Content-Type', 'text/html')
      if (cacheable) {
        microCache.set(req.url, html)
      }
      const time = Date.now() - s
      if (req.app.get('env') !== 'production') {
        if (time < 1000) {
          req.logger.debug(`whole request: ${time}ms`)
        } else {
          req.logger.warn(`whole request: ${time}ms`)
        }
      }
      res.set('x-ssr-time', time)
      res.end(html)
    })
  }
}
