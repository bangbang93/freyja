/**
 * Created by bangbang93 on 2017/3/20.
 */
'use strict';

const configure = {
  database: require('./default/database'),
  session: require('./default/session'),
  logger: require('./default/logger'),
  freyja: require('./default/freyja'),
}

const index = Object.keys(configure);

const env = process.env.NODE_ENV || 'development';

index.forEach((config)=>{
  try {
    require.resolve(`./${env}/${config}`)
    exports[config] = require(`./${env}/${config}`);
  } catch {}
});

module.exports = configure
