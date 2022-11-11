/**
 * Created by bangbang93 on 2017/9/19.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const crypto = require('crypto')

exports.md5 = (str) => crypto.createHash('md5')
  .update(str)
  .digest('hex')
