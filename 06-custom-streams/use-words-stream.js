import WordsStream from './words-stream.js'

const wordsStream = new WordsStream()

process.stdin
  .pipe(wordsStream)
  .pipe(process.stdout)
