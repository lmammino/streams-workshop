'use strict'

const { Readable } = require('readable-stream')

const endlessN = new Readable({
  read () {
    this.push(Math.random() + '\n')
  }
})

endlessN.pipe(process.stdout)
