import tap from 'tap'
import WriteToArraySolution from './write-to-array.solution.js'
import WriteToArrayTpl from './write-to-array.js'

const WriteToArray = process.env.TEST_SOLUTIONS ? WriteToArraySolution : WriteToArrayTpl

tap.test('It should write data to an array', function (t) {
  const toArray = new WriteToArray()
  toArray.on('error', t.fail)
  toArray.on('finish', () => {
    t.deepEqual(toArray.getData(), ['A', 'B', 'C'])
    t.end()
  })

  toArray.write('A')
  toArray.write('B')
  toArray.write('C')
  toArray.end()
})
