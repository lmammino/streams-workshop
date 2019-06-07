'use strict'

const testSuffix = process.env.TEST_SOLUTIONS ? '.solution.js' : ''

const WriteToArray = require('./write-to-array' + testSuffix)

test('It should write data to an array', done => {
  const toArray = new WriteToArray()
  toArray.on('error', done)
  toArray.on('finish', () => {
    expect(toArray.getData()).toEqual(['A', 'B', 'C'])
    done()
  })

  toArray.write('A')
  toArray.write('B')
  toArray.write('C')
  toArray.end()
})
