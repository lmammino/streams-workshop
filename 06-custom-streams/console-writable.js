import { Writable } from 'readable-stream'

export default class DOMAppend extends Writable {
  _write (chunk, encoding, done) {
    console.log(chunk.toString())
    done()
  }
}
