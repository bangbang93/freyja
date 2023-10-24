import {renderToString} from '@vue/server-renderer'
import {NextFunction, Request, Response} from 'express'
import {readFile} from 'fs/promises'
import {NotFound} from 'http-errors'
import LRU from 'lru-cache'
import ms from 'ms'
import {join} from 'path'
import {App} from 'vue'

const microCache = new LRU({
  max: 1000,
  maxAge: ms('30s'),
})

const isCacheable = (req: Request): boolean => {
  return req.app.get('env') === 'production'
}

export async function createServerRender(
  createApp: (context: Record<string, unknown>) => Promise<App>,
  port: number,
): Promise<(req: Request, res: Response, next: NextFunction) => Promise<void>> {
  const template = await readFile(join(__dirname, '../../client/dist/index.html'), 'utf8')
  const devalue = await eval('import("devalue")') as typeof import('devalue')
  return async function render(req, res, next): Promise<void | Response> {
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
      state: undefined,
    }
    try {
      const app = await createApp(context)
      const body = await renderToString(app, context)
      const html = template.replace('<app id="app"></app>', `<app id="app">${body}</app>`)
        .replace('<script id="ssr-state"></script>',
          `<script>window.__INITIAL_STATE__=${devalue.uneval(context.state)}</script>`)
      if (context.status) {
        res.status(context.status)
      }
      res.set('Content-Type', 'text/html')
      if (cacheable) {
        microCache.set(req.url, html)
      }
      const time = Date.now() - s
      res.set('x-ssr-time', time.toString())
      res.end(html)
    } catch (err: any) {
      if (err instanceof NotFound) {
        return next()
      }
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
