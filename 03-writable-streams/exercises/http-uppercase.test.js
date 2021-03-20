import MockReq from 'mock-req'
import tap from 'tap'
import sinon from 'sinon'

import makeServerSolution from './http-uppercase.solution.js'
import makeServerTpl from './http-uppercase.js'

const makeServer = process.env.TEST_SOLUTIONS ? makeServerSolution : makeServerTpl

tap.test('it should respond with uppercasified body', function (t) {
  const server = makeServer()

  const req = new MockReq({
    method: 'POST',
    url: '/',
    headers: {
      Accept: 'text/plain'
    }
  })

  const res = sinon.spy({
    write: () => false,
    end: () => {},
    once: (_, cb) => { cb() }
  })

  server.emit('request', req, res)
  req.write('hello ')
  req.end('world')

  req.on('end', () => {
    const callArgs = res.write.getCalls().flatMap(x => x.args)
    t.deepEqual(callArgs, ['HELLO ', 'WORLD'], 'Uppercasified the data in the request')
    t.true(res.once.called, 'Handling backpressure')
    t.true(res.end.calledOnce, 'Closing the response')
    t.end()
  })
})
