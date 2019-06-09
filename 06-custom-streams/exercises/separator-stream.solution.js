'use strict'

const { Transform } = require('readable-stream')

class SeparatorStream extends Transform {
  constructor (separator = '\n', options = {}) {
    super(options)
    this.separator = separator
  }

  _transform (chunk, enc, cb) {
    this.push(chunk.toString() + this.separator)
    cb()
  }
}

module.exports = SeparatorStream
