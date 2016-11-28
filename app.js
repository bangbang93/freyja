'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

if (app.get('env') == 'development'){
  app.use(logger('dev'));
  let webpack = require('webpack');
  let webpackConfig = require('./client/webpack.conf');
  let compiler = webpack(webpackConfig);
  let devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  });
  let hotMiddleware = require('webpack-hot-middleware')(compiler);
  app.use(devMiddleware);
  app.use(hotMiddleware);
} else {
  app.use(logger('combined'));
}

const RedisStore = require('connect-redis')(session);

app.use(session({
  store: new RedisStore({
    prefix: 'authSession'
  }),
  secret: '462fa48da315138ccac194c6d4cb5e05931b7d125acf8080bf4119439316dfce',
  resave: false,
  saveUninitialized: false,
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./route/index'));

require('express-simple-route')(path.join(__dirname, 'route'), app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
if (app.get('env') == 'development'){
  app.use(function (err, req, res, next) {
    res.status(500).json({
      message: err.message,
      err,
    })
  })
} else {
  app.use(function(err, req, res, next) {
    res.status(500).json({
      message: err.message,
    })
  });
}

module.exports = app;
