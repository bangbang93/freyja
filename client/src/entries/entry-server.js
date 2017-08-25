/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
import {createApp} from './index'

export default (context) => {
  return new Promise((resolve, reject) => {
    const {app, router} = createApp()
    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject({code: 404})
      }
      resolve(app)
    }, reject)
  })
}
