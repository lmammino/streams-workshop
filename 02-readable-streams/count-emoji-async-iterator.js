'use strict'

const { createReadStream } = require('fs')
const { EMOJI_MAP } = require('emoji') // from npm

async function main () {
  const emojis = Object.keys(EMOJI_MAP)
  const file = createReadStream(process.argv[2])
  let counter = 0

  for await (let chunk of file) {
    for (let char of chunk.toString('utf8')) {
      if (emojis.includes(char)) {
        counter++
      }
    }
  }

  console.log(`Found ${counter} emojis`)
}

main()
