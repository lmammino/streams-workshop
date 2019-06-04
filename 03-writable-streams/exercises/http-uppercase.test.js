'use strict'

const testSuffix = process.env.TEST_SOLUTIONS ? '.solution.js' : ''

const MockReq = require('mock-req')
const server = require('./http-uppercase' + testSuffix)

test('it should respond with uppercasified body', (done) => {
  const req = new MockReq({
    method: 'POST',
    url: '/',
    headers: {
      'Accept': 'text/plain'
    }
  })

  const res = {
    write: jest.fn(() => false),
    end: jest.fn(),
    once: jest.fn((_, cb) => { cb() })
  }

  server.emit('request', req, res)
  req.write('hello ')
  req.end('world')

  req.on('end', () => {
    expect(res.write).toHaveBeenCalledWith('HELLO ')
    expect(res.write).toHaveBeenCalledWith('WORLD')
    try {
      expect(res.once).toHaveBeenCalled()
    } catch (err) {
      return done(new Error('Are you handling backpressure?'))
    }
    expect(res.end).toHaveBeenCalled()
    done()
  })
})
