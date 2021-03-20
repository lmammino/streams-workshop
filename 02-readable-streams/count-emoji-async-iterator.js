import { createReadStream } from 'fs'
import emoji from 'emoji' // from npm

async function main () {
  const file = createReadStream(process.argv[2], { encoding: 'utf-8' })
  let counter = 0

  for await (const chunk of file) {
    for (const char of chunk.toString('utf8')) {
      if (emoji.EMOJI_MAP[char]) {
        counter++
      }
    }
  }

  console.log(`Found ${counter} emojis`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
