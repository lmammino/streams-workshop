# 02 - Readable Streams

- [02.1 What is a Readable stream](#021-what-is-a-readable-stream)
- [02.2 Flowing mode](#022-flowing-mode)
- [02.3 Paused mode](#023-paused-mode)


## 02.1 What is a Readable stream

A readable stream represents a source from which data is consumed. In a way, you can see Readable streams as an abstraction to consume some input.

Some common examples of Readable streams are the following:

- Read a file from the filesystem: `fs.createReadStream`
- Command line standard input: `process.stdin`
- An HTTP response (received by a client)
- An HTTP request (received by a server)
- AWS S3 `GetObject` (`data` field)

Readable streams support two modes for data consumption: **flowing** and **paused** (or **non-flowing**) mode.


## 02.2 Flowing mode

When using flowing mode, the data is read from source automatically and chunks are emitted as soon as they are available.

![Readable streams in flowing mode](./images/flowing-mode.gif)

- A Readable stream instance is automatically switched to flowing mode as soon as a listener for the `data` event is attached.
- At that point, every single time there's some data available a `data` event is emitted.
- When no more data is available, the `end` event is emitted.

In this example, we use flowing mode to consume data from a file and count the number of emojis:

```javascript
// count-emoji-flowing.js

const { createReadStream } = require('fs')
const { EMOJI_MAP } = require('emoji') // from npm

const emojis = Object.keys(EMOJI_MAP)

const file = createReadStream(process.argv[2])
let counter = 0

file.on('data', chunk => {
  for (let char of chunk.toString('utf8')) {
    if (emojis.includes(char)) {
      counter++
    }
  }
})

file.on('end', () => console.log(`Found ${counter} emojis`))

file.on('error', err => console.error(`Error reading file: ${err}`))
```

> **🎭 PLAY**  
> Play with this script a bit and try to run it against some of the emoji art files available in the [`assets`](/assets) folder.


## 02.3 Paused mode

...



---

| [⬅️ 01 - Buffer vs Stream](/01-buffer-vs-stream/README.md) | [🏠](/README.md)| [03 - Writable Streams ➡️](/03-writable-streams/README.md)|
|:--------------|:------:|------------------------------------------------:|
