'use strict'

const WordsStream = require('./words-stream')

const wordsStream = new WordsStream()

process.stdin
  .pipe(wordsStream)
  .pipe(process.stdout)
