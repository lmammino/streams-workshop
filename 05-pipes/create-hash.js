'use strict'

const { createHash } = require('crypto')
const { createReadStream, createWriteStream } = require('fs')

const [,, filename] = process.argv

const hashStream = createHash('sha256')
const input = createReadStream(filename)
const output = createWriteStream(filename + '.sha')

input
  .pipe(hashStream)
  .pipe(output)
