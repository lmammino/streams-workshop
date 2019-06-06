'use strict'

const testSuffix = process.env.TEST_SOLUTIONS ? '.solution.js' : ''

const { Readable, Writable, pipeline } = require('readable-stream')
const { createEncgz, createDecgz } = require('./encgz' + testSuffix)

const SECRET = Buffer.from('Elbert Hubbard')
const IV = Buffer.from('9fab79663db375c8439cc38ffa9239fd', 'hex')
const CLEAN_DATA = Buffer.from('One machine can do the work of fifty ordinary men. No machine can do the work of one extraordinary man.')
const ENCRYPTED_DATA = Buffer.from('H4sIAAAAAAAAEwFwAI//Q43rjDMahJx4q16eVFh9wKV74ZKAdLQkMF1/7k4iihWhwNRKM1XJlqwvX+GQ8t7dWQNfvSoco6JXfz81GFJq67VURppdpNMSVuvZrdONx0a/0pf0WppckaOFicWsAy6pwgle/otKo/vz+XK7Mhqz8sy1rENwAAAA', 'base64')

class BufferStream extends Readable {
  constructor (buffer, options) {
    super(options)
    this.buffer = buffer
  }

  _read () {
    this.push(this.buffer)
    this.push(null)
  }
}

class Accumulator extends Writable {
  constructor (options) {
    super(options)
    this.data = Buffer.alloc(0)
  }

  _write (chunk, enc, done) {
    this.data = Buffer.concat([this.data, chunk])
    done()
  }

  getData () {
    return this.data
  }
}

test('It encrypts and compress some data properly', done => {
  const source = new BufferStream(CLEAN_DATA)
  const transform = createEncgz(SECRET, IV)
  const dest = new Accumulator()

  pipeline(
    source,
    transform,
    dest,
    (err) => {
      if (err) {
        throw err
      }

      const data = dest.getData()
      expect(data).toEqual(ENCRYPTED_DATA)
      done()
    }
  )
})

test('It decompress and decrypts some data properly', done => {
  const source = new BufferStream(ENCRYPTED_DATA)
  const transform = createDecgz(SECRET, IV)
  const dest = new Accumulator()

  pipeline(
    source,
    transform,
    dest,
    (err) => {
      if (err) {
        throw err
      }

      const data = dest.getData()
      expect(data).toEqual(CLEAN_DATA)
      done()
    }
  )
})
