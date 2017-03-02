'use strict';
const router = require('express-promise-router')();

router.get('/', async function(req, res) {
  await new Promise(function (resolve, reject) {
    setTimeout(()=>resolve(), 2000);
  });
  res.json({message: 'await'});
});

router.get('/error', async function (req, res) {
  let err = new Error('some thing happened');
  err.req = req.url;
  throw err;
});


module.exports = router;
