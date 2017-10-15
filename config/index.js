/**
 * Created by bangbang93 on 2017/3/20.
 */
'use strict';
const fs = require('fs');
const path = require('path');

exports.database = require('./default/database.json');

exports.session = require('./default/session.json');

exports.logger = require('./default/logger');

exports.freyja = require('./default/freyja')

const index = Object.keys(exports);

const env = process.env.NODE_ENV || 'development';

index.forEach((config)=>{
  if (fs.existsSync(path.join(__dirname, env, `${config}.json`))
    || fs.existsSync(path.join(__dirname, env,`${config}.js`))
    || fs.existsSync(path.join(__dirname, env,`${config}.ts`))) {
    exports[config] = require(`./${env}/${config}`);
  }
});
