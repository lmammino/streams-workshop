'use strict'

const {
  createReadStream,
  createWriteStream
} = require('fs')

const [,, src, dest] = process.argv

// create source stream
const srcStream = createReadStream(src)

// create destination stream
const destStream = createWriteStream(dest)

// when there's data on the source stream,
// write it to the dest stream
// WARNING, this solution is not perfect as we will see later
srcStream.on('data', (chunk) => destStream.write(chunk))
