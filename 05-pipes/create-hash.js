import { createHash } from 'crypto'
import { createReadStream, createWriteStream } from 'fs'

const [,, filename] = process.argv

const hashStream = createHash('sha256')
const input = createReadStream(filename)
const output = createWriteStream(filename + '.sha')

input
  .pipe(hashStream)
  .pipe(output)
