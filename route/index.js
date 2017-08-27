'use strict';
const express = require('express');
const router = express.Router();

router.get('/time', function (req, res) {
  res.send(new Date())
})


module.exports = router;
