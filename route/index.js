'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({
    message: 'it works',
    home: 'goto /home',
  })
});


module.exports = router;
