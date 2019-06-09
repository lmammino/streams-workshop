'use strict'

const testSuffix = process.env.TEST_SOLUTIONS ? '.solution.js' : ''

const { Writable, pipeline } = require('readable-stream')
const FibStream = require('./fib-stream' + testSuffix)

class ArrAccumulator extends Writable {
  constructor (options) {
    super(options)
    this.data = []
  }

  _write (chunk, enc, done) {
    this.data.push(Number.parseInt(chunk.toString()))
    done()
  }

  getData () {
    return this.data
  }
}

const EXPECTED = [1, 1, 2, 3, 5, 8, 13]

test('It should output the correct sequence of fib numbers smaller than 20', done => {
  const fibStream = new FibStream(20)
  const accumulator = new ArrAccumulator()

  pipeline(
    fibStream,
    accumulator,
    (err) => {
      if (err) {
        throw err
      }

      expect(accumulator.getData()).toEqual(EXPECTED)
      done()
    }
  )
})
