/**
 * Created by bangbang93 on 2017/3/20.
 */
'use strict'
const configure = {
  database: require('./default/database'),
  jwt: require('./default/jwt'),
  logger: require('./default/logger'),
  freyja: require('./default/freyja'),
}

const index = Object.keys(configure)

const env = process.env.CONFIG_ENV ?? process.env.NODE_ENV ?? 'development'

index.forEach((config) => {
  try {
    require.resolve(`./${env}/${config}`)
    const envConfig = require(`./${env}/${config}`)
    // jwt 段按键合并，环境文件只需覆盖提供的键（如仅注入 secret）；其余段整段替换
    configure[config] = config === 'jwt'
      ? {...configure[config], ...envConfig}
      : envConfig
  } catch {
    // ignore
  }
})

module.exports = configure
