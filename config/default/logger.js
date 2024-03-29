/**
 * Created by bangbang93 on 2017/4/28.
 */
'use strict'

const streams = [
  {
    type: 'raw',
    stream: process.stdout,
  }, {
    level: 'fatal',
    stream: process.stderr,
  },
]

const Loggers = {
  middleware: {
    name: 'haruhi',
    level: 'info',
    streams,
  },
}

module.exports = function getLogger(name) {
  const defaultLogger = {
    name,
    level: 'debug',
    streams,
  }

  let loggers = Loggers
  const steps = name.split('.')
  for (const step of steps) {
    if (step in loggers) {
      loggers = loggers[step]
    } else {
      return defaultLogger
    }
  }
  return loggers
}
