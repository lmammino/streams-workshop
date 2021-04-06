# 01 - Buffer vs Stream

- [01.1 Buffers intro](#011-buffers-intro)
- [01.2 Streaming intro](#012-streaming-intro)
- [01.3 Memory / Time comparison](#013-memory--time-comparison)
- [01.4 Our friend `Buffer`](#014-our-friend-buffer)
- [01.5 Our new friend stream](#015-our-new-friend-stream)
- [01.6 Summary](#016-summary)


## 01.1 Buffers intro

What is a buffer?

Buffers are an abstraction that allows us to deal with raw binary data in Node.js! They are particularly relevant when we are dealing with files and networks or I/O in general.

Let's create some buffers with some data:

```javascript
// buffer-data.js

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

// Raw buffer data can be "visualized" as a string, as hex or base64
console.log(bufferFromString.toString('utf-8')) // Ciao human ('utf-8' is the default)
console.log(bufferFromString.toString('hex')) // 4369616f2068756d616e
console.log(bufferFromString.toString('base64')) // Q2lhbyBodW1hbg==

// You can get the size of a buffer (in bytes) by using `length`
console.log(bufferFromString.length) // 10
```

Now, let's create a Node.js script to copy a file from one place to another using buffers:

```javascript
// buffer-copy.js

import {
  readFile,
  writeFile
} from 'fs/promises'

async function copyFile (src, dest) {
  // read entire file content
  const content = await readFile(src)
  // write that content somewhere else
  return writeFile(dest, content)
}

// `src` is the first argument from cli, `dest` the second
const [,, src, dest] = process.argv

// start the copy and handle the result
copyFile(src, dest)
  .then(() => console.log(`${src} copied into ${dest}`))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
```

You can use this script as follows:

```bash
node 01-buffer-vs-stream/buffer-copy.js <source-file> <dest-file>
```

> **🎭 PLAY**  
> Play with this a bit and try to copy some files in your machine.

But did you ever wonder what happens when you try to copy a big file (let's say about 3Gb)?

> **🎭 PLAY**  
> Generate a big file (3gb) called `assets/3Gb.bin` in your machine with:
>
> ```bash
> head -c $((3*1024*1024*1024)) /dev/urandom > assets/3Gb.bin
> ```
>
> Be patient, this might take a bit...
> Now try to copy it with our previous script.

What happens is that you should see your script dramatically failing with the following error:

```plain
RangeError [ERR_FS_FILE_TOO_LARGE]: File size (3221225472) is greater than 2 GB
    at readFileHandle (internal/fs/promises.js:273:11)
    at async copyFile (file:///.../streams-workshop/01-buffer-vs-stream/buffer-copy.js:8:19) {
  code: 'ERR_FS_FILE_TOO_LARGE'
}
```

Why is this happening? 😱

Essentially because when we use `fs.readFile` we load all the binary content from the file in memory using a `Buffer` object. Buffers are, by design, limited in size as they live in memory.

> **✏️ Tip**
>
> You can create a buffer with the maximum allowed size with the following code:
> 
> ```javascript
> // biggest-buffer.js
> 
> import buffer from 'buffer'
> 
> // Careful, this will allocate a few GBs of memory!
> const biggestBuffer = Buffer.alloc(buffer.constants.MAX_LENGTH) // creates a buffer with the maximum possible size
> console.log(biggestBuffer) // <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 4294967245 more bytes>
> ```

Let's try to explain this better with an analogy...

Imagine that, instead of copying bytes of data, you are using Mario to move blocks from one place to another:

![Mario trying to move some blocks](./images/buffer-analogy-001.jpg)

Mario can lift some blocks:

![Mario can lift some blocks](./images/buffer-analogy-002.jpg)

But, if he has to move many blocks, he can't definitely move all of them in one go; Mario's strength is limited:

![Mario can't move many blocks in one go](./images/buffer-analogy-003.jpg)

So what can he do? What if he wants to find an approach that works independently from the number of blocks he has to move?

![Mario can move the blocks one by one, he can stream them!](./images/buffer-analogy-004.jpg)

Mario can move the blocks one by one, he can stream them!


In a way, we can think about streams as an abstraction that allows us to deal with portions of data (**chunks**) arriving at different moments in time. Every chunk is a `Buffer` instance.


## 01.2 Streaming intro

How can we convert our copy file implementation into a streaming one?

It's very easy actually:

```javascript
// stream-copy.js

import {
  createReadStream,
  createWriteStream
} from 'fs'

const [,, src, dest] = process.argv

// create source stream
const srcStream = createReadStream(src)

// create destination stream
const destStream = createWriteStream(dest)

// when there's data on the source stream,
// write it to the dest stream
// WARNING, this solution is not perfect as we will see later
srcStream.on('data', (chunk) => destStream.write(chunk))
```

Essentially we are replacing `readFile` with `createReadStream` and `writeFile` with `createWriteStream`.

`createReadStream` and `createWriteStream` are then used to create two stream instances `srcStream` and `destStream`.

These objects are respectively instances of a `ReadableStream` (input) and a `WritableStream` (output) and we will talk more in detail about these in the next chapters.

For now, the only important detail to understand is that streams are not *eager*, they don't read all the data in one go. The data is read in *chunks*, small portions of data. You can immediately use a chunk as soon as it is available through the `data` event. In our case, when a new chunk of data is available in the source stream we immediately write it to the destination stream. This way we never have to keep all the file content in memory.

Keep in mind that this implementation here is not bullet-proof, there are some rough edge cases that we will discover later while discussing Writable streams in more detail, but for now this is good enough to understand the basic principles of stream processing in Node.js!

> **🎭 PLAY**  
> Try to copy our `3Gb.bin` using this new streaming implementation!


## 01.3 Memory / Time comparison

Let's now see how the two implementations (buffer and streaming) compare in terms of memory usage and execution time.

One way that we can see how much data is being allocated in buffers by a Node.js script is by calling:

```javascript
process.memoryUsage().arrayBuffers
```

This will give us the number of bytes allocated for buffers.

Before we can start to do some tests let's create a 600Mb file called `assets/600mb.bin`:

```bash
head -c $((600*1024*1024)) /dev/urandom > assets/600mb.bin
```

This might take few minutes... be patient, please.

Now I have prepared some "modified" versions of our buffer and stream copy scripts that will output the allocated buffer size every 100ms while the copy is in progress.

If you are curious to look at source files you can checkout [`buffer-copy-profile.js`](./buffer-copy-profile.js) and [`stream-copy-profile.js`](./stream-copy-profile.js).

Finally we can run the following command to see how the buffer based implementation behaves:

```bash
time node 01-buffer-vs-stream/buffer-copy-profile.js assets/600mb.bin assets/600mb.bin_copy
```

With this command we should see something similar to the following output:

```plain
   43.7545 Mb
   87.5985 Mb
  136.0218 Mb
  181.0432 Mb
  229.0107 Mb
  272.5029 Mb
  317.6631 Mb
  364.3407 Mb
  410.5568 Mb
  455.7325 Mb
  498.7198 Mb
  545.6628 Mb
  589.6431 Mb
  ...
  600.3535 Mb
  600.6088 Mb
  600.3667 Mb
  600.3263 Mb
  600.5572 Mb
  600.7419 Mb
  600.2206 Mb
  600.4537 Mb
  600.7435 Mb
  600.2381 Mb
assets/600mb.bin copied into assets/600mb.bin_copy

real	0m4.321s
user	0m1.864s
sys	0m2.133s
```

As expected the buffered version is allocating around 600 Mb of data in memory (the entire file!).

If we run the stream version instead:

```bash
time node 01-buffer-vs-stream/stream-copy-profile.js assets/600mb.bin assets/600mb.bin_copy
```

In this case we should see something like:

```plain
    0.1344 Mb
    3.5719 Mb
    8.2594 Mb
   10.3219 Mb
   16.1969 Mb
   20.1344 Mb
   10.0719 Mb
   16.5719 Mb
    2.6969 Mb
    2.6969 Mb
   16.5094 Mb
    1.9469 Mb
    7.5719 Mb
    4.0094 Mb
    2.8844 Mb
   11.1969 Mb
    2.2594 Mb
    9.3219 Mb
assets/600mb.bin copied into assets/600mb.bin_copy

real	0m1.984s
user	0m0.574s
sys	0m1.248s
```

Note how with the streaming approach we are never allocating more than a few Mbs of data. Moreover, this version of the script was twice as fast to complete compared to the previous implementation!

> **🎭 PLAY**  
> Why not to try the same exercise with the 3Gb file?

At this point you should have clear in mind why Streams are so convenient 🙂


## 01.4 Our friend `Buffer`

The `Buffer` object is such a fundamental concept in Node.js and it's heavily used also with streams. So it's definitely worth spending some extra minutes to get more familiar with it.

In its essence a Buffer is a data structure that allows us to manage raw binary data.

As we saw at the beginning of this lesson, the most common way to create a buffer from scratch is by using the `.from` method:

```javascript
const a = Buffer.from('Hello') // data from a utf-8 string
const b = Buffer.from('48656c6c6f', 'hex') // data from an hex string
const c = Buffer.from('SGVsbG8=', 'base64') // data from a base64 encoded binary sequence
const d = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]) // data from an array of integers (bytes)
```

If you console log one of these instances you will get something like this:

```plain
<Buffer 48 65 6c 6c 6f>
```

Or if you do something like:

```javascript
const b = Buffer.from('48656c6c6f', 'hex')
console.log(b.toJSON())
```

You will see something like this:

```json
{
  "type": "Buffer",
  "data": [ 72, 101, 108, 108, 111 ]
}
```

Which is naother proof that, internally, a buffer is simply an array of bytes.

Another common way to create a buffer instance is `Buffer.alloc(n)` that allows you to create an empty buffer (all zeros) of `n` bytes.

If you want to inspect the content of a Buffer instance you can do that with the `.toString(encoding)` method, which accepts different types of encoding such as `'base64'`, `'hex'` or `'utf8'` (default value).

```javascript
const a = Buffer.from('Hello')
a.toString() // 'Hello'
a.toString('hex') // '48656c6c6f'
a.toString('base64') // 'SGVsbG8='
```

To get the size of a buffer (in bytes) you can use the property `.length`:

```javascript
const a = Buffer.from('Hello')
const b = Buffer.from('Hello👻')
const c = Buffer.from('👻')
a.length // 5
b.length // 9
c.length // 4 (yes, an emoji is a multi-byte character!)
```

Other useful operations on buffers are `.slice` and `Buffer.concat`. `.slice` allows you to get an arbitrary sub-section of a buffer:

```javascript
const a = Buffer.from('Hello dear friends')
a.slice(6,10).toString() // 'dear'
```

`Buffer.concat([...buffers])` allows you to concatenate the content of 2 or more buffers:

```javascript
const a1 = Buffer.from('Hello')
const a2 = Buffer.from(', ')
const a3 = Buffer.from('World')
const all = Buffer.concat([a1, a2, a3])
all.toString() // 'Hello, World'
```

> **🎭 PLAY**  
> Try all the commands above in a Node.js shell


## 01.5 Our new friend stream

Streams are the topic of this workshop, so we will definitely go into great depth!

For now there are only 2 important things to keep in mind about streams instances:

- Every stream is an event emitter (we already saw the `data` event)
- In the `streamInstance.on('data', (chunk) => {})` event, `chunk` is a buffer instance that contains the current portion of the data being read from the source

> **🏹 Exercise** ([count-bytes.js](/01-buffer-vs-stream/exercises/count-bytes.js))
>
> Write a function that receives a stream and counts the number of bytes in the stream.
>
> A skeleton of the file is available at `01-buffer-vs-stream/exercises/count-bytes.js`.
>
> You can edit the file and run an interactive test session to validate your implementation with:
>
> ```bash
> npm run ex -- 01-buffer-vs-stream/exercises/count-bytes.test.js
> ```
>
> If you really struggle with this, you can have a look at [`count-bytes.solution.js`](/01-buffer-vs-stream/exercises/count-bytes.solution.js) for a possible solution.


## 01.6 Summary

At this point you should be more familiar with the concepts of buffer and stream and you should start to understand how streams are a convenient paradigm in comparison with loading big buffers straight into memory.

If I had to summarise why streams are better than buffers, here are few points:

- Streams can keep a **low memory footprint** even with large amounts of data
- Streams allows you to **process data as soon as it is available**


That's all for now, congratulations on finishing the first chapter! 🎉

Take a little break and get ready to move to the [Next section](/02-readable-streams/README.md).

---

| [⬅️ 00 - Intro](/README.md) | [🏠](/README.md)| [02 - Readable Streams ➡️](/02-readable-streams/README.md)|
|:--------------|:------:|------------------------------------------------:|
