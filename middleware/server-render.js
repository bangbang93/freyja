/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';


module.exports = function (renderer) {
  return function render (req, res) {
    const s = Date.now()

    res.setHeader("Content-Type", "text/html")

    const handleError = err => {
      if (err.url) {
        res.redirect(err.url)
      } else if(err.code === 404) {
        res.status(404).end('404 | Page Not Found')
      } else {
        // Render Error Page or Redirect
        res.status(500).end('500 | Internal Server Error')
        console.error(`error during render : ${req.url}`)
        console.error(err.stack)
      }
    }

    // const cacheable = isCacheable(req)
    // if (cacheable) {
    //   const hit = microCache.get(req.url)
    //   if (hit) {
    //     if (!isProd) {
    //       console.log(`cache hit!`)
    //     }
    //     return res.end(hit)
    //   }
    // }

    const context = {
      title: 'Vue HN 2.0', // default title
      url: req.url
    }
    renderer.renderToString(context, (err, html) => {
      if (err) {
        return handleError(err)
      }
      res.end(html)
      // if (cacheable) {
      //   microCache.set(req.url, html)
      // }
      if (!req.app.get('env') !== 'production') {
        console.log(`whole request: ${Date.now() - s}ms`)
      }
    })
  }
}
