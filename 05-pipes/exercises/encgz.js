'use strict'

const { createHash } = require('crypto')

/**
 * Helper function to create properly sized keys from secrets of arbitrary length
 */
function createCipherKey (secret) {
  return createHash('md5').update(secret).digest('hex')
}

/**
 * This function takes a secret as a string (or buffer) and an initialization
 * vector as a Buffer. It should return a Transform stream that encrypts the
 * incoming data using the "aes256" algorithm and then compresses the resulting
 * data using gzip
 */
function createEncgz (secret, iv) {
  const cipherKey = createCipherKey(secret)
  // Add your code here...
}

/**
 * This function takes a secret as a string (or buffer) and an initialization
 * vector as a Buffer. It should return a Transform stream that decompress the
 * incoming data using gunzip, and then decrypts the data using the "aes256"
 * algorithm with the given secret and iv
 */
function createDecgz (secret, iv) {
  const cipherKey = createCipherKey(secret)
  // Add your code here...
}

module.exports = {
  createEncgz,
  createDecgz
}
