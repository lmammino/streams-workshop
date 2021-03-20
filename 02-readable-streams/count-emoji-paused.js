import { createReadStream } from 'fs'
import { EMOJI_MAP } from 'emoji' // from npm

const emojis = Object.keys(EMOJI_MAP)

const file = createReadStream(process.argv[2], { encoding: 'utf-8' })
let counter = 0

file.on('readable', () => {
  let chunk
  while ((chunk = file.read()) !== null) {
    for (const char of chunk.toString('utf8')) {
      if (emojis.includes(char)) {
        counter++
      }
    }
  }
})

file.on('end', () => console.log(`Found ${counter} emojis`))

file.on('error', err => console.error(`Error reading file: ${err}`))
