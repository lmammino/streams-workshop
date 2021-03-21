import { Transform } from 'readable-stream'
import DateStream from './date-stream.js'

const dateStream = new DateStream()
const jsonify = new Transform({
  objectMode: true,
  transform (chunk, enc, done) {
    this.push(JSON.stringify(chunk) + '\n')
    done()
  }
})

dateStream
  .pipe(jsonify)
  .pipe(process.stdout)
