import {renderToString} from '@vue/server-renderer'
import {Request, Response} from 'express'
import LRU from 'lru-cache'
import {App} from 'vue'
import ms = require('ms')

const microCache = new LRU({
  max: 1000,
  maxAge: ms('30s'),
})

const isCacheable = (req: Request) => {
  return req.app.get('env') === 'production'
}

export default function serverRender(
  app: App,
  port: number,
): (req: Request, res: Response, next: any) => any {
  return async function render(req, res, next) {
    const s = Date.now()

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

    const origin = `http://localhost:${port}`

    const context = {
      title: 'Freyja', // default title
      url: req.url,
      origin,
      referer: `${req.protocol}://${req.hostname}${req.url}`,
      status: null,
    }
    try {
      const html = await renderToString(app, context)
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
          // req.logger.debug(`whole request: ${time}ms`)
        } else {
          // req.logger.warn(`whole request: ${time}ms`)
        }
      }
      res.set('x-ssr-time', time.toString())
      res.end(html)
    } catch (err: any) {
      const time = Date.now() - s
      res.set('x-ssr-time', time.toString())
      if (err.url) {
        res.redirect(err.url as string)
      } else if (err.code === 404) {
        return next()
      } else {
        // Render Error Page or Redirect
        return next(err)
      }
    }
  }
}
