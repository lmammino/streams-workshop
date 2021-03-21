import emoji from 'emoji'
import { Readable } from 'readable-stream'

const emojis = Object.keys(emoji.EMOJI_MAP)

function getEmojiDescription (index) {
  return emoji.EMOJI_MAP[emojis[index]][1]
}

function getMessage (index) {
  return emojis[index] + ' ' + getEmojiDescription(index)
}

export default class EmojiStream extends Readable {
  constructor (options) {
    super(options)
    this._index = 0
  }

  _read () {
    if (this._index >= emojis.length) {
      return this.push(null)
    }
    return this.push(getMessage(this._index++))
  }
}
