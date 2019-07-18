/**
 * Created by bangbang93 on 2017/3/20.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const configure = {
  database: require('./default/database'),
  session : require('./default/session'),
  logger  : require('./default/logger'),
  freyja  : require('./default/freyja'),
}

const index = Object.keys(configure)

const env = process.env.NODE_ENV || 'development'

index.forEach((config) => {
  try {
    require.resolve(`./${env}/${config}`)
    configure[config] = require(`./${env}/${config}`)
  } catch {
    // ignore
  }
})

module.exports = configure
