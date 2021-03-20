'use strict'

const { Transform } = require('readable-stream')

class CountBytes extends Transform {
  constructor (options) {
    super(options)
    this.bytes = 0
  }

  getBytes () {
    return this.bytes
  }

  _transform (chunk, enc, done) {
    this.bytes += chunk.length
    this.push(chunk)
    done()
  }
}

module.exports = CountBytes
