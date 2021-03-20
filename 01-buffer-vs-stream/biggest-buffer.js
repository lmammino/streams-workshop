import buffer from 'buffer'

// Careful, this will allocate a few GBs of memory!
const biggestBuffer = Buffer.alloc(buffer.constants.MAX_LENGTH) // creates a buffer with the maximum possible size
console.log(biggestBuffer) // <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 4294967245 more bytes>
