import { createServer } from 'http'

// Write a "uppercasify" web server. A server that takes the incoming text in
// the body of the request and responds with the same text but "uppercasified".
// Don't forget to handle backpressure!

export default function makeServer () {
  return createServer((req, res) => {
    // ... write your code here

    // read the source data with
    // req.on('data', (chunk) => {})

    // write the response with
    // res.write(chunk)
    // remember to uppercasify and to handle backpressure

    // when req is finished we need to end the response
  })
}
