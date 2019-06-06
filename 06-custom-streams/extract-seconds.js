'use strict'

const { Transform } = require('readable-stream')
const DateStream = require('./date-stream')

const dateStream = new DateStream()
const extractSecond = new Transform({
  objectMode: true,
  transform (date, enc, done) {
    this.push(date.getSeconds() + '\n')
    done()
  }
})

dateStream.pipe(extractSecond).pipe(process.stdout)
