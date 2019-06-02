'use strict'

const countBytes = (srcStream, cb) => {
  let bytes = 0
  srcStream.on('end', () => cb(bytes))
  srcStream.on('data', (chunk) => {
    bytes += chunk.length
  })
}

module.exports = countBytes
