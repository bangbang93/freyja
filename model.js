/**
 * Created by bangbang93 on 14-10-24.
 */
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const Config = require('./config').database
const Redis = require('ioredis')
const mongoose = require('mongoose')

mongoose.connect(`mongodb://${Config.mongodb.host}/${Config.mongodb.database}`)

mongoose.Promise = require('bluebird')

exports.redis = new Redis(Config.redis)

exports.mongoose = mongoose
