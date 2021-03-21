import { Writable } from 'readable-stream'

/**
 * Write a Writable stream that accumulates the written data into an array.
 * Every time that a write on the stream is performed, the given chunk is stored
 * as a string as a new element in the array (last element).
 */
export default class WriteToArray extends Writable {
  _write (chunk, enc, done) {
    // logic to write the data in the accumulator array
  }

  getData () {
    // return the array with the accumulated data
  }
}
