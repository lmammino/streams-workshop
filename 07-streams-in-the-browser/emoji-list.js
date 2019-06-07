'use strict'

const { pipeline } = require('readable-stream')
const EmojiStream = require('../06-custom-streams/emoji-stream')
const Uppercasify = require('../06-custom-streams/uppercasify')
const DOMAppend = require('../06-custom-streams/dom-append')

pipeline(
  new EmojiStream(),
  new Uppercasify(),
  new DOMAppend(),
  (err) => {
    if (err) {
      console.error(err)
    }
  }
)
