/**
 * Created by bangbang93 on 2017/3/20.
 */
'use strict';
const fs = require('fs');
const path = require('path');

exports.database = require('./database.default.json');

exports.session = require('./session.default.json');

exports.logger = require('./logger.default');

const index = Object.keys(exports);

const env = process.env.NODE_ENV || 'development';

index.forEach((config)=>{
  if (fs.existsSync(path.join(__dirname, `${config}.${env}.json`)) || fs.existsSync(path.join(__dirname, `${config}.${env}.js`)) ){
    exports[config] = require(`./${config}.${env}`);
  }
});