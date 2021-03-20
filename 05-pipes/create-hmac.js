import { createHmac } from 'crypto'
import { createReadStream, createWriteStream } from 'fs'

const [,, filename, secret] = process.argv

const hmacStream = createHmac('sha256', secret)
const input = createReadStream(filename)
const output = createWriteStream(filename + '.hmac')

input
  .pipe(hmacStream)
  .pipe(output)
