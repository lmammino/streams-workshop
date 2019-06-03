'use strict'

const { createReadStream, createWriteStream } = require('fs')

const [, , src, dest] = process.argv
const srcStream = createReadStream(src)
const destStream = createWriteStream(dest)

srcStream.on('data', data => {
  const canContinue = destStream.write(data)
  if (!canContinue) {
    // we are overflowing the destination, we should pause
    srcStream.pause()
    // we will resume when the destination stream is drained
    destStream.once('drain', () => srcStream.resume())
  }
})
