// 'use strict'

// const { EMOJI_MAP } = require('emoji') // from npm
// const { Readable } = require('readable-stream') // from npm

// const emojis = Object.keys(EMOJI_MAP)

// function getEmojiDescription (index) {
//   return EMOJI_MAP[emojis[index]][1]
// }

// function getMessage (index) {
//   return emojis[index] + ' ' + getEmojiDescription(index)
// }

// class EmojiStream extends Readable {
//   constructor (options) {
//     super(options)
//     this._index = 0
//   }

//   _read () {
//     if (this._index >= emojis.length) {
//       return this.push(null)
//     }
//     return this.push(getMessage(this._index++))
//   }
// }

// module.exports = EmojiStream
