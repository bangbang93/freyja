/**
 * Created by bangbang93 on 2017/4/28.
 */
'use strict';
const bunyanPrettyStream = require('bunyan-prettystream');

const prettyStream = new bunyanPrettyStream();
prettyStream.pipe(process.stdout);

module.exports = {
  service: {
    socket: {
      name: 'service',
      service: 'socket',
      level: 'debug',
      streams: [{
        type: 'raw',
        stream: prettyStream
      }]
    }
  },
  socket: {
    chat: {
      name: 'socket',
      namespace: 'chat',
      level: 'trace',
      streams: [{
        type: 'raw',
        stream: prettyStream
      }]
    }
  }
};