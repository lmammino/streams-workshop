'use strict'

const countBytes = (srcStream, cb) => {
  let bytes = 0
  srcStream.on('error', (err) => cb(err))
  srcStream.on('end', () => cb(null, bytes))
  srcStream.on('data', (chunk) => {
    bytes += chunk.length
  })
}

module.exports = countBytes
