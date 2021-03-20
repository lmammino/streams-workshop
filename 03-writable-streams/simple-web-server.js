import { createServer } from 'http'

const server = createServer((req, res) => {
  res.end('Hello world!')
})

server.listen(8000)
