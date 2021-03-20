import { request } from 'http'

const req = request(
  {
    hostname: 'webhook.site',
    method: 'POST',
    path: '/af766141-b50e-484c-a8bd-617ea36a6f40' // get your id at webhook.site
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
