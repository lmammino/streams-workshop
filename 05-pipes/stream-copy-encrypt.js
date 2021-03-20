'use strict'

import {
  createReadStream,
  createWriteStream
} from 'fs'

import {
  randomBytes,
  createHash,
  createCipheriv
} from 'crypto'

const [, , src, dest, secret] = process.argv

// secret must be 128bit, so, in order to be able to use arbitrary strings, we calculate the md5 of the string and use the result as secret.
const cipherKey = createHash('md5').update(secret).digest('hex')

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
