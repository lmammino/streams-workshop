'use strict'

const countWords = async (srcStream, cb) => {
  let numWords = 0
  let lastWordFromPreviousChunk = ''

  for await (let chunk of srcStream) {
    const words = (lastWordFromPreviousChunk + chunk.toString()).split(/\s+/)
    lastWordFromPreviousChunk = words.pop()

    numWords += words.length
  }

  return cb(null, numWords)
}

module.exports = countWords
