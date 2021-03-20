// 'use strict'

// const { Readable } = require('readable-stream')

// class FibStream extends Readable {
//   constructor (max = Number.MAX_SAFE_INTEGER, options) {
//     super(options)
//     this._max = max
//     this._n1 = 0
//     this._n2 = 0
//   }

//   _read () {
//     const nextVal = this._n2 === 0 ? 1 : this._n1 + this._n2
//     const prevVal = this._n2
//     this._n2 = nextVal
//     this._n1 = prevVal

//     if (nextVal >= this._max) {
//       this.push(null) // terminates the stream
//       return
//     }

//     this.push(String(nextVal))
//   }
// }

// module.exports = FibStream
