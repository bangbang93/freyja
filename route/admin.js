/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
const router = require('express-promise-router')()
const history = require('connect-history-api-fallback');

router.use(history())

module.exports = router;
