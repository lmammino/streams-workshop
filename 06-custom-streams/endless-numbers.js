import { Readable } from 'readable-stream'

const endlessN = new Readable({
  read () {
    this.push(Math.random() + '\n')
  }
})

endlessN.pipe(process.stdout)
