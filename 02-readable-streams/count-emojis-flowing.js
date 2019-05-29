'use strict'

const { createReadStream } = require('fs')
const { EMOJI_MAP } = require('emoji') // from npm

const emojis = Object.keys(EMOJI_MAP)

const file = createReadStream(process.argv[2])
let counter = 0

file.on('data', chunk => {
  for (let char of chunk.toString('utf8')) {
    if (emojis.includes(char)) {
      counter++
    }
  }
})

file.on('end', () => console.log(`Found ${counter} emojis`))

file.on('error', err => console.error(`Error reading file: ${err}`))
