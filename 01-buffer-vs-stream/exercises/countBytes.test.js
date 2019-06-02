'use strict'

const { join } = require('path')
const { createReadStream } = require('fs')
const { createGunzip } = require('zlib')
const countBytes = require('./countBytes')

test('It should count the right number of bytes', done => {
  const filePath = join(__dirname, '..', '..', 'assets', 'moby-dick.txt.gz')
  const srcStream = createReadStream(filePath)
  const unzippedStream = srcStream.pipe(createGunzip())

  countBytes(unzippedStream, (err, bytes) => {
    if (err) {
      throw err
    }

    expect(bytes).toBe(1234481)
    done()
  })
})
