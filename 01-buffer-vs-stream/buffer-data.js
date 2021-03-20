// Let's create some buffers with some data
const bufferFromString = Buffer.from('Ciao human')
const bufferFromByteArray = Buffer.from([67, 105, 97, 111, 32, 104, 117, 109, 97, 110])
const bufferFromHex = Buffer.from('4369616f2068756d616e', 'hex')
const bufferFromBase64 = Buffer.from('Q2lhbyBodW1hbg==', 'base64')

// data is stored in binary format
console.log(bufferFromString) // <Buffer 43 69 61 6f 20 68 75 6d 61 6e>
console.log(bufferFromByteArray) // <Buffer 43 69 61 6f 20 68 75 6d 61 6e>
console.log(bufferFromHex) // <Buffer 43 69 61 6f 20 68 75 6d 61 6e>
console.log(bufferFromBase64) // <Buffer 43 69 61 6f 20 68 75 6d 61 6e>

// Raw buffer data can be "visualized" in hex and base64
console.log(bufferFromString.toString('utf-8')) // Ciao human ('utf-8' is the default)
console.log(bufferFromString.toString('hex')) // 4369616f2068756d616e
console.log(bufferFromString.toString('base64')) // Q2lhbyBodW1hbg==
