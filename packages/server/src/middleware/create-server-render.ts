import is from '@sindresorhus/is'
import {NextFunction, Request, Response} from 'express'
import {NotFound} from 'http-errors'
import LRU from 'lru-cache'
import ms from 'ms'
import type {HttpResponse} from 'vike/dist/esm/node/runtime/renderPage/createHttpResponse'
import {renderPage} from 'vike/server'

const microCache = new LRU<string, HttpResponse>({
  max: 1000,
  maxAge: ms('30s'),
})

// eslint-disable-next-line @typescript-eslint/require-await
export async function createServerRender(
  port: number,
  env?: string,
): Promise<(req: Request, res: Response, next: NextFunction) => Promise<void | Response>> {
  if (env === 'production') {
    // eslint-disable-next-line no-useless-concat
    await import('../../../home/dist/server/importBuild.cjs' + '')
  }
  return async function render(req, res, next): Promise<void | Response> {
    const s = Date.now()

    const cacheable = env === 'production'
    if (cacheable) {
      const hit = microCache.get(req.url)
      if (hit) {
        res.set('x-ssr-cache', 'hit')
        return sendResponse(req, res, hit, cacheable, s)
      }
    }
    res.set('x-ssr-cache', 'miss')

    const origin = `http://localhost:${port}`

    const context = {
      title: 'Freyja', // default title
      urlOriginal: req.url,
      origin,
      referer: `${req.protocol}://${req.hostname}${req.url}`,
      status: null,
      state: undefined,
    }
    try {
      const pageContext = await renderPage(context)
      const {httpResponse} = pageContext
      if (!httpResponse) {
        return next()
      } else {
        return sendResponse(req, res, httpResponse, cacheable, s)
      }
    } catch (err) {
      if (err instanceof NotFound) {
        return next()
      }
      const time = Date.now() - s
      res.set('x-ssr-time', time.toString())
      if (is.object(err) && err !== null && 'url' in err) {
        if (err.url) {
          res.redirect(err.url as string)
        } else if ('code' in err && err.code === 404) {
          return next()
        } else {
          // Render Error Page or Redirect
          return next(err)
        }
      } else {
        throw err
      }
    }
  }
}

function sendResponse(req: Request, res: Response, httpResponse: HttpResponse,
  cacheable: boolean, startTime: number): void {
  const {body, statusCode, headers, earlyHints} = httpResponse

  if (res.writeEarlyHints && process.env.ENABLE_EARLY_HINTS) {
    res.writeEarlyHints({link: earlyHints.map((e) => e.earlyHintLink)})
  }

  headers.forEach(([name, value]) => res.setHeader(name, value))
  res.status(statusCode)
  if (cacheable) {
    microCache.set(req.url, httpResponse)
  }
  const time = Date.now() - startTime
  res.set('x-ssr-time', time.toString())
  // For HTTP streams use httpResponse.pipe() instead, see https://vike.dev/stream
  res.send(body)
}
