import { Writable, pipeline } from 'readable-stream'
import tap from 'tap'
import FibStreamSolution from './fib-stream.solution.js'
import FibStreamTpl from './fib-stream.js'

const FibStream = process.env.TEST_SOLUTIONS ? FibStreamSolution : FibStreamTpl

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

tap.test('It should output the correct sequence of fib numbers smaller than 20', function (t) {
  const fibStream = new FibStream(20)
  const accumulator = new ArrAccumulator()

  pipeline(
    fibStream,
    accumulator,
    (err) => {
      if (err) {
        throw err
      }

      t.deepEqual(accumulator.getData(), EXPECTED)
      t.end()
    }
  )
})
