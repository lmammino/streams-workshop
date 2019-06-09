'use strict'

const { Readable } = require('readable-stream')

/**
 * Implement a Readable stream that allows you to consume all numbers in the
 * fibonacci sequence that are smaller than a given max number
 */
class FibStream extends Readable {
  constructor (max = Number.MAX_SAFE_INTEGER, options) {
    super(options)
    this._max = max
    this._n1 = 0
    this._n2 = 0
  }

  _read () {
    let nextVal = this._n2 === 0 ? 1 : this._n1 + this._n2
    const prevVal = this._n2
    this._n2 = nextVal
    this._n1 = prevVal

    // complete the implementation from here
    // make sure you call this.push with the correct value
    // and that you also terminate the stream correctly.
    // remember to emit the number as a string.
  }
}

module.exports = FibStream
