import { createReadStream } from 'fs'
import { createGunzip } from 'zlib'
import { join } from 'desm'
import tap from 'tap'

import countBytesSolution from './count-bytes.solution.js'
import countBytesTpl from './count-bytes.js'

const countBytes = process.env.TEST_SOLUTIONS ? countBytesSolution : countBytesTpl

tap.test('It should count the right number of bytes', async function (t) {
  const filePath = join(import.meta.url, '..', '..', 'assets', 'moby-dick.txt.gz')
  const srcStream = createReadStream(filePath)
  const unzippedStream = srcStream.pipe(createGunzip())

  const bytes = await countBytes(unzippedStream)
  t.equal(bytes, 1234481)
})
