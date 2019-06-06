'use strict'

const { createGzip, createGunzip } = require('zlib')
const { createHash, createCipheriv, createDecipheriv } = require('crypto')
const pumpify = require('pumpify')

function createCipherKey (secret) {
  return createHash('md5').update(secret).digest('hex')
}

function createEncgz (secret, iv) {
  const cipherKey = createCipherKey(secret)
  const encryptStream = createCipheriv('aes256', cipherKey, iv)
  const gzipStream = createGzip()

  const stream = pumpify(encryptStream, gzipStream)

  return stream
}

function createDecgz (secret, iv) {
  const cipherKey = createCipherKey(secret)
  const decryptStream = createDecipheriv('aes256', cipherKey, iv)
  const gunzipStream = createGunzip()

  const stream = pumpify(gunzipStream, decryptStream)
  return stream
}

module.exports = {
  createEncgz,
  createDecgz
}
