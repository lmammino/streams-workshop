'use strict'

const {
  readFileSync,
  writeFileSync
} = require('fs')

// `src` is the first argument from cli, `dest` the second
const [,, src, dest] = process.argv

// read entire file content
const content = readFileSync(src)

// write that content somewhere else
writeFileSync(dest, content)
