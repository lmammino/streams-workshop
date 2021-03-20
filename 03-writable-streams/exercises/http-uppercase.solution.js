import { createServer } from 'http'

export default function makeServer () {
  return createServer((req, res) => {
    req.on('data', (chunk) => {
      const canContinue = res.write(chunk.toString().toUpperCase())
      if (!canContinue) {
        req.pause()
        res.once('drain', () => req.resume())
      }
    })
    req.on('end', () => res.end())
  })
}
