'use strict'

const { Transform } = require('readable-stream')

class Uppercasify extends Transform {
  _transform (chunk, encoding, done) {
    this.push(chunk.toString().toUpperCase())
    done()
  }
}

module.exports = Uppercasify
