import { Transform } from 'readable-stream'

export default class WordsStream extends Transform {
  constructor (options) {
    super(options)
    this.lastWord = ''
  }

  _transform (chunk, enc, cb) {
    // prepends the last word to the new data
    const newData = this.lastWord + chunk.toString()
    const words = newData.split(/\W+/)

    // removes the last word in the chunk
    this.lastWord = words.pop()

    // emit every single word remaining in the array
    for (const word of words) {
      this.push(word)
    }

    cb()
  }

  _flush (cb) {
    if (this.lastWord) {
      this.push(this.lastWord)
    }

    cb()
  }
}
