'use strict'

const {
  createReadStream,
  createWriteStream
} = require('fs')
const { createGzip } = require('zlib')

const [, , src, dest] = process.argv
const srcStream = createReadStream(src)
const gzipStream = createGzip()
const destStream = createWriteStream(dest)

srcStream
  .pipe(gzipStream)
  .pipe(destStream)
