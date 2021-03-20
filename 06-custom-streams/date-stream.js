import { Readable } from 'readable-stream'

export default class DateStream extends Readable {
  constructor (options = {}) {
    options.objectMode = true // forces object mode
    super(options)
  }

  _read () {
    this.push(new Date())
  }
}
