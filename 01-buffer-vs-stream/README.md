# 01 - Buffer vs Stream

- [01.1 buffers intro](#011-buffers-intro)
- [01.2 Streaming intro](#012-streaming-intro)
- [01.3 Memory comparison](#013-memory-comparison)
- [01.4 Our friend `Buffer`](#014-our-friend-buffer)
- [01.5 Our new friend stream](#015-our-new-friend-stream)


## 01.1 buffers intro

Let's create a Node.js script to copy a file from one place to another:

```javascript
// buffer-copy.js

const {
  readFileSync,
  writeFileSync
} = require('fs')

// `src` is the first argument from cli, `dest` the second
const [,, src, dest] = process.argv

// read entire file content
const content = readFileSync(src)

// write that content somewhere else
writeFileSync(dest, content)
```

You can use this script as follows:

```bash
node buffer-copy <source-file> <dest-file>
```

> **🎭 PLAY**  
> Play with this a bit and try to copy some files in your machine.

But did you ever wonder what happens when you try to copy a big file (more than 1.5Gb)?

> **🎭 PLAY**  
> Generate a big file (3gb) called `assets/3Gb.bin` in your machine with:
>
> ```bash
> head -c $((3*1024*1024*1024)) /dev/urandom > assets/3Gb.bin
> ```
>
> Now try to copy it with our previous script.

What happens is that you should see your script dramatically failing with the following error:

```plain
ERR_FS_FILE_TOO_LARGE: File size is greater than possible Buffer
```

Why is this happening?

Essentially because when we use `fs.readFileSync` we load all the binary content from the file in memory into a `Buffer` object. Buffers are limited in size as they live in memory.

Let's try to explain this better with an analogy...

Imagine instead of copying bytes of data you have to help Mario moving blocks from one place to another:

![Mario trying to move some blocks](./images/buffer-analogy-001.jpg)

Mario can lift some blocks:

![Mario can lift some blocks](./images/buffer-analogy-002.jpg)

But, if you have to move many blocks, he can't definitely move all of them in one go:

![Mario can't move many blocks in one go](./images/buffer-analogy-003.jpg)

So what can we do? What if we want to find an approach that works independently from the number of blocks we have to move?

![Mario can move the blocks one by one, he can stream them!](./images/buffer-analogy-004.jpg)

Mario can move the blocks one by one, he can stream them!


## 01.2 Streaming intro

How can we convert our implementation into a streaming one?

It's very easy actually:

```javascript
// stream-copy.js

const {
  createReadStream,
  createWriteStream
} = require('fs')

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

Essentially we are replacing `readFileSync` with `createReadStream` and `writeFileSync` with `createWriteStream`.

`createReadStream` and `createWriteStream` are then used to create two stream instances `srcStream` and `destStream`. These objects are respectively instances of a `ReadableStream` (input) and a `WritableStream` (output) and we will talk more in detail about these in the next chapters. For now, the only important detail to understand is that streams are not *eager*, they don't read all the data in one go. The data is read in *chunks*, small portions of data. You can immediately use a chunk as soon as it is available through the `data` event. In our case, when a new chunk of data is available in the source stream we immediately write it to the destination stream. This way we never have to keep all the file content in memory.

This implementation here is not perfect, there are some rough edge cases that we will discover later while discussing Writable streams in mode detail, but for now this is good enough to understand the basic principles of stream processing in Node.js!

> **🎭 PLAY**  
> Try to copy our `big-file.txt` using this new streaming implementation!


## 01.3 Memory comparison

Let's now see how the two implementations (buffer and streaming) compare in terms of memory usage. We can do that by using Google Chrome developer tools.

First of all let's create a 600Mb file called `assets/60mb.txt`:

```bash
head -c $((600*1024*1024)) /dev/urandom > assets/600mb.bin
```

Now let's run the buffer copy in debug mode from the directory `01-buffer-vs-stream`:

```bash
node --inspect-brk buffer-copy.js ../assets/600mb.bin ../assets/600mb.bin_copy
```

This script will pause straight away thanks to the `--inspect-brk` flag.

Open Google Chrome and visit [chrome://inspect/](chrome://inspect/).

Click on the **inspect** link at the bottom of the page.

This should open a Chrome developer tool window.

You can see that our script is currently paused. Add a breakpoint in the last line where we write the content to the destination (so that the script will stop before executing that last line). Now execute the script and see it getting paused in the last line by the breakpoint. At this point, switch to the **Memory** tab and select the option **Heap Snapshoot** and then click the button **Take Snapshot**. This operation allows you to see all the memory currently allocated by the Node.js process.

![Debugging memory with Chrome Dev Tools](./images/chrome-dev-tools-memory.gif)

If all went as expected you should see that the total amount of memory is around 600Mb. Not surprising right? If we load all the content of the file in a buffer, the content of the file is essentially loaded all in memory!

> **🎭 PLAY**  
> Try to do the same with our streaming alternative to find out how much memory is used!
>
> Advice: since the streaming approach is asynchronous is hard to put a meaningful breakpoint. In order to make things easy, you can add the following line at the end of the code:
>
> ```javascript
> srcStream.on('end', () => destStream.end())
> destStream.on('finish', () => {
>   console.log('done')
> })
> ```
>
> Now you can add the breakpoint in the `console.log` line

How much memory did you get?

> **🎭 PLAY**  
> Why not to try the same exercise with the 3Gb file?

At this point you should have clear in mind why Streams are so convenient 🙂


## 01.4 Our friend `Buffer`

The `Buffer` object is such a fundamental concept in Node.js and it's heavily used also with streams. So it's definitely worth spending some extra minutes to get more familiar with it.

In its essence a Buffer is a data structure that allows us to manage raw binary data.

The most common way to create a buffer from scratch is by using the `.from` method:

```javascript
const a = Buffer.from('Hello') // data from a utf8 string
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

Which is the proof that, internally, a buffer is represented as an array of bytes.

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

Other useful operations on buffers are `.slice` and `Buffer.concat`. `.slice allows you to get an arbitrary sub section of a buffer`:

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

...

---

| [⬅️ 00 - Intro](/README.md) | [🏠](/README.md)| [02 - Readable Streams ➡️](/02-readable-streams)|
|:--------------|:------:|------------------------------------------------:|
