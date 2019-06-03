'use strict'

const http = require('http')

const req = http.request(
  {
    hostname: 'enx6b07hdu6cs.x.pipedream.net',
    method: 'POST'
  },
  (resp) => {
    console.log(`Server responded with "${resp.statusCode}"`)
  }
)

req.on('finish', () => console.log('request sent'))
req.on('close', () => console.log('Connection closed'))
req.on('error', err => console.error(`Request failed: ${err}`))

req.write('writing some content...\n')
req.end('last write & close the stream')
