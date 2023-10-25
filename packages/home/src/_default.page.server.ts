/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import {renderToString} from '@vue/server-renderer'
import * as devalue from 'devalue'
import * as HttpErrors from 'http-errors'
import {dangerouslySkipEscape, escapeInject} from 'vike/server'
import {PageContext} from 'vike/types'
import {createHome} from './entries'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vike {
    interface PageContext {
      origin: string
      referer: string
      state: Record<string, unknown>
      status: object
    }
  }
}

export async function render(pageContext: PageContext) {
  const {app, router, store} = createHome()
  await router.push(pageContext.urlOriginal)

  await router.isReady()
  const matchedComponents = router.currentRoute.value.matched.flatMap((e) => {
    if (e.components) {
      return Object.values(e.components)
    }
    return []
  })
  if (!matchedComponents.length) {
    throw new HttpErrors.NotFound('no such route')
  }
  await Promise.all(
    matchedComponents.map(async (component) => {
      if (!component) return null
      if ('asyncData' in component && component.asyncData) {
        store.commit('setOrigin', pageContext.origin)
        store.commit('setReferer', pageContext.referer)
        return component.asyncData({
          store,
          route: router.currentRoute.value,
        })
      }
      return null
    }),
  )

  pageContext.state = store.state
  if (router.currentRoute.value.meta.status) {
    pageContext.status = router.currentRoute.value.meta.status
  }

  const appHtml = await renderToString(app)
  const documentProps = pageContext.exports.documentProps as Record<string, string | undefined>
  const title = documentProps?.title || 'Vite SSR app'
  const desc = documentProps?.description || 'App using Vite + Vike'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        <script>
          window.__INITIAL_STATE__ = ${dangerouslySkipEscape(devalue.uneval(pageContext.state))}
        </script>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here,
      // which is useful if we want to do page redirection
      // https://vike.dev/page-redirection
    },
  }
}
