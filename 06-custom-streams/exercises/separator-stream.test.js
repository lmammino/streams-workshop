'use strict'

const testSuffix = process.env.TEST_SOLUTIONS ? '.solution.js' : ''

const { Readable, Writable, pipeline } = require('readable-stream')
const SeparatorStream = require('./separator-stream' + testSuffix)

test('It should proper separator between chunks', done => {
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

      expect(data).toEqual(EXPECTED)
      done()
    }
  )
})
