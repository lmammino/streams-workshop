import { Writable } from 'readable-stream'

export default class WriteToArray extends Writable {
  constructor (options) {
    super(options)
    this.data = []
  }

  _write (chunk, enc, done) {
    this.data.push(chunk.toString())
    done()
  }

  getData () {
    return this.data
  }
}
