'use strict'

/*
  Exercise

  Write a function that receives a stream and counts the number of bytes in the stream.
*/

const countBytes = (srcStream, cb) => {
  // ... implement here the logic to count the number of bytes in the stream
  // ... invoke the callback passing null (or an error) and the actual number when the stream is finished
  return cb(null, 0)
}

module.exports = countBytes
