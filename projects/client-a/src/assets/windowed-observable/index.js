
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./windowed-observable.cjs.production.min.js')
} else {
  module.exports = require('./windowed-observable.cjs.development.js')
}
