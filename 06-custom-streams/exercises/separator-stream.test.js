import { Readable, Writable, pipeline } from 'readable-stream'
import tap from 'tap'
import SeparatorStreamSolution from './separator-stream.solution.js'
import SeparatorStreamTpl from './separator-stream.js'

const SeparatorStream = process.env.TEST_SOLUTIONS ? SeparatorStreamSolution : SeparatorStreamTpl

tap.test('It should proper separator between chunks', function (t) {
  const EXPECTED = 'hello-beautiful-world-'

  const chunks = ['hello', 'beautiful', 'world']
  let index = -1
  const source = new Readable({
    read () {
      if (index >= chunks.length) {
        return this.push(null)
      }

      this.push(chunks[index++])
    }
  })

  const separatorStream = new SeparatorStream('-')
  let data = ''
  const dest = new Writable({
    write (chunk, enc, done) {
      data += chunk.toString()
      done()
    }
  })

  pipeline(
    source,
    separatorStream,
    dest,
    (err) => {
      if (err) {
        throw err
      }

      t.deepEqual(data, EXPECTED)
      t.end()
    }
  )
})
