import { Transform } from 'readable-stream'
import DateStream from './date-stream.js'

const dateStream = new DateStream()
const extractSecond = new Transform({
  objectMode: true,
  transform (date, enc, done) {
    this.push(date.getSeconds() + '\n')
    done()
  }
})

dateStream.pipe(extractSecond).pipe(process.stdout)
