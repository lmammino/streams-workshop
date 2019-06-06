'use strict'

const { Readable } = require('readable-stream')

class DateStream extends Readable {
  constructor (options = {}) {
    options.objectMode = true // forces object mode
    super(options)
  }

  _read () {
    this.push(new Date())
  }
}

module.exports = DateStream
