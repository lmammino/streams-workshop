'use strict'

/*
  Exercise

  Write a function that receives a stream and counts the number of words in the stream.
  Be careful that in a chunk you might receive a word that is currently truncated, so
  try to figure out how to reconcile words spanning 2 chunks.
*/

const countWords = (srcStream, cb) => {
  // ... implement here the logic to count the number of words in the stream
  // ... invoke the callback passing null (or an error) and the actual number when the stream is finished
  return cb(null, 0)
}

module.exports = countWords
