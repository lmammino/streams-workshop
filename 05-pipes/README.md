# 05 - Pipes

- [05.1 Piping things together](#051-piping-things-together)
- [05.2 Streaming compression and encryption](#052-streaming-compression-and-encryption)


## 05.1 Piping things together

So, how do we combine streams together and have data flowing between them naturally?

In general, if we want to *copy* data over from a Readable stream to a Writable stream we can use the following approach:

```javascript
readable.pipe(writable)
```

Here `.pipe` will do all these amazing things for you:

 - Connects the Readable stream to the Writable stream: all the data read from `readable` is *automagically™️* written to the `writable` in a streaming fashion.
 - Handles the `end` event properly, once all the data is copied over the writable, that is properly closed.
 - It returns a new instance of a stream so that you can keep using `.pipe` to connect many streams together. This is mostly useful with transform streams.

Ok, let's say now that we want to introduce a Transform stream in between our Readable and Writable stream. We call our streams `readable`, `transform` and `writable`, this is how you can connect them in a nice pipeline:

```javascript
readable
  .pipe(transform)
  .pipe(writable)
```

And this is not limited to a single transformation, if you have two separate transform steps, say `transform1` and `transform2`, you can do something like this:

```javascript
readable
  .pipe(transform1)
  .pipe(transform2)
  .pipe(writable)
```

Isn't this much nicer that dealing with all those events? Yes it is, and it's also a lot more readable.

This is, in fact, the most common way you will see people using Node.js streams and you can build all sorts of complicated multi-stage streaming pipelines, like this one:

```javascript
readableFileStream
  .pipe(decompressStream)
  .pipe(decryptStream)
  .pipe(convertStream)
  .pipe(encryptStream)
  .pipe(compressStream)
  .pipe(writableFileStream)
```

I don't even have to explain what's the goal here, because the code should be readable enough to get the gist of it!


## 05.2 Streaming compression and encryption

Now that we know the power of `.pipe()` let's explore some very common Transform stream so that we can put this new power to use.

Let's start by introducing the built-in module `zlib`, which gives you some nice functionality for data compression. These are the most important streaming functions from the module in my opinion:

 - `zlib.createGzip` / `zlib.createGunzip`: creates Transform streams to compress and decompress data using the Gzip algorithm.
 - `zlib.createDeflate` / `zlib.createInflate`: creates Transform streams to compress and decompress data using the Deflate algorithm.
 - `zlib.createBrotliCompress` / `zlib.createBrotliDecompress`: creates Transform streams to compress and decompress data using the Brotli algorithm.

Let's now try to use this module to implement the `stream-copy-gzip`, but this time also adopting `.pipe`:

```javascript
// stream-copy-gzip-pipe.js

const {
  createReadStream,
  createWriteStream
} = require('fs')
const { createGzip } = require('zlib')

const [, , src, dest] = process.argv
const srcStream = createReadStream(src)
const gzipStream = createGzip()
const destStream = createWriteStream(dest)

srcStream
  .pipe(gzipStream)
  .pipe(destStream)
```

...

---

| [⬅️ 04 - Transform streams](/04-transform-streams/README.md) | [🏠](/README.md)| [06 - Custom Streams ➡️](/06-custom-streams/README.md)|
|:--------------|:------:|------------------------------------------------:|
