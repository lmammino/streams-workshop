'use strict'

const { join } = require('path')
const { createReadStream } = require('fs')
const { createGunzip } = require('zlib')
const countWords = require('./countWords')

test('It should count the right number of words', done => {
  const filePath = join(__dirname, '..', '..', 'assets', 'moby-dick.txt.gz')
  const srcStream = createReadStream(filePath)
  const unzippedStream = srcStream.pipe(createGunzip())

  countWords(unzippedStream, (err, bytes) => {
    if (err) {
      throw err
    }

    expect(bytes).toBe(212793)
    done()
  })
})
