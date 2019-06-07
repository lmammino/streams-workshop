'use strict'

const { Transform } = require('readable-stream')
const DateStream = require('./date-stream')

const dateStream = new DateStream()
const jsonify = new Transform({
  objectMode: true,
  transform (chunk, enc, done) {
    this.push(JSON.stringify(chunk) + '\n')
    done()
  }
})

dateStream
  .pipe(jsonify)
  .pipe(process.stdout)
