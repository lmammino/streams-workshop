import { createServer } from 'http'

// Write a "uppercasify" web server. A server that takes the incoming text in
// the body of the request and responds with the same text but "uppercasified".
// Don't forget to handle backpressure!

export default function makeServer () {
  return createServer((req, res) => {
    // ... write your code here
  })
}
