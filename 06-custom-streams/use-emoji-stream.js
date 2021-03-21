import EmojiStream from './emoji-stream.js'

const emojiStream = new EmojiStream()
emojiStream.pipe(process.stdout)
