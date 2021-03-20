import { createReadStream } from 'fs'
import emoji from 'emoji' // from npm

const file = createReadStream(process.argv[2], { encoding: 'utf-8' })
let counter = 0

file.on('readable', () => {
  let chunk
  while ((chunk = file.read()) !== null) {
    for (const char of chunk.toString('utf8')) {
      if (emoji.EMOJI_MAP[char]) {
        counter++
      }
    }
  }
})

file.on('end', () => console.log(`Found ${counter} emojis`))
file.on('error', err => console.error(`Error reading file: ${err}`))
