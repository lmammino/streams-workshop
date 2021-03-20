import { createReadStream } from 'fs'
import { createGunzip } from 'zlib'
import { join } from 'desm'
import tap from 'tap'

import countWordsSolution from './count-words.solution.js'
import countWordsTpl from './count-words.js'

const countWords = process.env.TEST_SOLUTIONS ? countWordsSolution : countWordsTpl

tap.test('It should count the right number of words', async function (t) {
  const filePath = join(import.meta.url, '..', '..', 'assets', 'moby-dick.txt.gz')
  const srcStream = createReadStream(filePath)
  const unzippedStream = srcStream.pipe(createGunzip())

  const bytes = await countWords(unzippedStream)
  t.equal(bytes, 212793)
})
