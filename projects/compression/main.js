import { createWriteStream } from 'fs'
import { createGzip, createDeflate, createBrotliCompress } from 'zlib'
import CountBytes from './count-bytes'

const originalFileSize = new CountBytes()

const gzip = createGzip()
const deflate = createDeflate()
const brotli = createBrotliCompress()

const gzipFileSize = new CountBytes()
const deflateFileSize = new CountBytes()
const brotliFileSize = new CountBytes()

const createNullStream = () => createWriteStream('/dev/null')

const sourceStream = process.stdin.pipe(originalFileSize)

const onFinish = (name, original, compressed) => {
  const ratio = (compressed.getBytes() / original.getBytes() * 100).toPrecision(4)
  console.log(`[${name}]\tcompressed data (${compressed.getBytes()} bytes) is ${ratio}% of the original file (${original.getBytes()} bytes)`)
}

sourceStream
  .pipe(gzip)
  .pipe(gzipFileSize)
  .pipe(createNullStream())
  .on('finish', () => {
    onFinish('gzip', originalFileSize, gzipFileSize)
  })

sourceStream
  .pipe(deflate)
  .pipe(deflateFileSize)
  .pipe(createNullStream())
  .on('finish', () => {
    onFinish('deflate', originalFileSize, deflateFileSize)
  })

sourceStream
  .pipe(brotli)
  .pipe(brotliFileSize)
  .pipe(createNullStream())
  .on('finish', () => {
    onFinish('brotli', originalFileSize, brotliFileSize)
  })
