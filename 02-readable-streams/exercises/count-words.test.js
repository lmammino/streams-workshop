'use strict'

const testSuffix = process.env.TEST_SOLUTIONS ? '.solution.js' : ''

const { join } = require('path')
const { createReadStream } = require('fs')
const { createGunzip } = require('zlib')
const countWords = require('./count-words' + testSuffix)

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
