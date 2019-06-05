'use strict'

const {
  createReadStream,
  createWriteStream
} = require('fs')

const {
  randomBytes,
  createCipheriv
} = require('crypto')

// secret must be 128bit (you could calculate the md5 of a arbitrary string to make that fit)
const [, , src, dest, cipherKey] = process.argv

// a random initialization bytes vector (needed for decryption)
const initVect = randomBytes(16)

const srcStream = createReadStream(src)
const encryptStream = createCipheriv('aes256', cipherKey, initVect)
const destStream = createWriteStream(dest)

srcStream
  .pipe(encryptStream)
  .pipe(destStream)
  .on('finish', () => {
    console.log(`File encrypted (init vect: ${initVect.toString('hex')})`)
  })
