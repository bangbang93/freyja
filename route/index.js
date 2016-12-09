'use strict';
const express = require('express');
const router = express.Router();
const history = require('connect-history-api-fallback');

/* GET home page. */
router.get('/', function(req, res) {
  res.json({
    message: 'it works'
  })
});

router.all('/home', history({
  index: '/index.html'
}));


module.exports = router;
