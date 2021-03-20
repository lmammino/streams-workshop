import { createGzip, createGunzip } from 'zlib'
import { createHash, createCipheriv, createDecipheriv } from 'crypto'
import pumpify from 'pumpify'

function createCipherKey (secret) {
  return createHash('md5').update(secret).digest('hex')
}

export function createEncgz (secret, iv) {
  const cipherKey = createCipherKey(secret)
  const encryptStream = createCipheriv('aes256', cipherKey, iv)
  const gzipStream = createGzip()

  const stream = pumpify(encryptStream, gzipStream)

  return stream
}

export function createDecgz (secret, iv) {
  const cipherKey = createCipherKey(secret)
  const decryptStream = createDecipheriv('aes256', cipherKey, iv)
  const gunzipStream = createGunzip()

  const stream = pumpify(gunzipStream, decryptStream)
  return stream
}
