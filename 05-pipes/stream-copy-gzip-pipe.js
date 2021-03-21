import {
  createReadStream,
  createWriteStream
} from 'fs'
import { createGzip } from 'zlib'

const [, , src, dest] = process.argv
const srcStream = createReadStream(src)
const gzipStream = createGzip()
const destStream = createWriteStream(dest)

srcStream
  .pipe(gzipStream)
  .pipe(destStream)
