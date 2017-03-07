'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');

const app = express();
app.set('trust proxy', 'loopback');

if (app.get('env') == 'development'){
  app.use(logger('dev'));
} else {
  app.use(logger('combined'));
}

const session = require('express-session');
const RedisStore = require('connect-redis')(session);

app.use(cookieParser());
app.use(session({
  store: new RedisStore({
    prefix: 'authSession'
  }),
  secret: 'iivrdWiKUpfIhb0OEQgmqTOrcroiHTJ0jF9FS48VrFo=',
  resave: false,
  saveUninitialized: false,
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./route/index'));

require('express-simple-route')(path.join(__dirname, 'route'), app);

app.use(history({
  verbose: true
}));

if (app.get('env') == 'development'){
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
}

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    message: 'not found'
  })
});

// error handler
if (app.get('env') == 'development'){
  app.use(function (err, req, res, next) {
    console.error(err);
    if (res.headersSent) return;
    res.status(500).json({
      message: err.message,
      err,
    })
  })
} else {
  app.use(function(err, req, res, next) {
    console.error(err);
    if (res.headersSent) return;
    res.status(500).json({
      message: err.message,
    })
  });
}

module.exports = app;
