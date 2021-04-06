# 05 - Pipes

- [05.1 Piping things together](#051-piping-things-together)
- [05.2 Streaming compression and encryption](#052-streaming-compression-and-encryption)
- [05.3 Error handling and pipeline](#053-error-handling-and-pipeline)
- [05.4 Composability and `pumpify`](#054-composability-and-pumpify)
- [05.5 Summary](055-summary)


## 05.1 Piping things together

So, how do we combine streams together and have data flowing between them naturally?

In general, if we want to *copy* data over from a Readable stream to a Writable stream we can use the following approach:

```javascript
readable.pipe(writable)
```

Here `.pipe` will do all these amazing things for you:

 - Connects the Readable stream to the Writable stream: all the data read from `readable` is *automagically™️* copied over the `writable` stream, chunk by chunk.
 - Handles the `end` event properly, once all the data is copied over the writable, both readable and writable are properly closed.
 - It returns a new instance of a stream so that you can keep using `.pipe` to connect many streams together. This is mostly useful with transform streams and it allows us to create complex pipelines for data processing.

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

Let's start by introducing the built-in module [`zlib`](https://nodejs.org/api/zlib.html), which gives you some nice functionality for data compression. These are the most important streaming functions from the module in my opinion:

 - [`zlib.createGzip`](https://nodejs.org/api/zlib.html#zlib_zlib_creategzip_options) / [`zlib.createGunzip`](https://nodejs.org/api/zlib.html#zlib_zlib_creategunzip_options): creates Transform streams to compress and decompress data using the Gzip algorithm.
 - [`zlib.createDeflate`](https://nodejs.org/api/zlib.html#zlib_zlib_createdeflate_options) / [`zlib.createInflate`](https://nodejs.org/api/zlib.html#zlib_zlib_createinflate_options): creates Transform streams to compress and decompress data using the Deflate algorithm.
 - [`zlib.createBrotliCompress`](https://nodejs.org/api/zlib.html#zlib_zlib_createbrotlicompress_options) / [`zlib.createBrotliDecompress`](https://nodejs.org/api/zlib.html#zlib_zlib_createbrotlidecompress_options): creates Transform streams to compress and decompress data using the Brotli algorithm.

Let's now try to use this module to implement the `stream-copy-gzip`, but this time also adopting `.pipe`:

```javascript
// stream-copy-gzip-pipe.js

import {
  createReadStream,
  createWriteStream
} from 'fs'
import { createGzip } from 'zlib'

const [, , src, dest] = process.argv
const srcStream = createReadStream(src)
const gzipStream = createGzip()
const destStream = createWriteStream(dest)

srcStream
  .pipe(gzipStream)
  .pipe(destStream)
```

> **🎭 PLAY**  
> Play with this script for a bit and maybe try to use other compression algorithms from the `zlib` module.

The [`crypto`](https://nodejs.org/api/crypto.html) built-in module offers some interesting utilities to perform crypto operations using Transform streams:

 - [`crypto.createCipheriv`](https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options) / [`crypto.createDecipheriv`](https://nodejs.org/api/crypto.html#crypto_crypto_createdecipheriv_algorithm_key_iv_options): create encryption and decryption streams.
 - [`crypto.createHash`](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options): creates a Transform stream that calculates the hash of the content that is flowing through the stream.
 - [`crypto.createHmac`](https://nodejs.org/api/crypto.html#crypto_crypto_createhmac_algorithm_key_options): creates a Transform stream that creates a signature for the data flowing through the stream.

Here follows some quick examples on how you can use these functions.

Encrypt a file:

```javascript
// stream-copy-encrypt.js

import {
  createReadStream,
  createWriteStream
} from 'fs'

import {
  randomBytes,
  createHash,
  createCipheriv
} from 'crypto'

const [, , src, dest, secret] = process.argv

// secret must be 128bit, so, in order to be able to use arbitrary strings, we calculate the md5 of the string and use the result as secret.
const cipherKey = createHash('md5').update(secret).digest('hex')

// a random initialization bytes vector (needed for decryption)
const initVect = randomBytes(16)

const srcStream = createReadStream(src)
const encryptStream = createCipheriv('aes256', cipherKey, initVect)
const destStream = createWriteStream(dest)

srcStream
  .pipe(encryptStream)
  .pipe(destStream)
  .on('finish', () => {
    console.log(`File encrypted (init vect: ${initVect.toString('hex')})`)
  })
```

Create the SHA hash of a file:

```javascript
// create-hash.js

import { createHash } from 'crypto'
import { createReadStream, createWriteStream } from 'fs'

const [,, filename] = process.argv

const hashStream = createHash('sha256')
const input = createReadStream(filename)
const output = createWriteStream(filename + '.sha')

input
  .pipe(hashStream)
  .pipe(output)
```

Create the HMAC (signature) of a file with a given secret:

```javascript
// create-hmac.js

import { createHmac } from 'crypto'
import { createReadStream, createWriteStream } from 'fs'

const [,, filename, secret] = process.argv

const hmacStream = createHmac('sha256', secret)
const input = createReadStream(filename)
const output = createWriteStream(filename + '.hmac')

input
  .pipe(hmacStream)
  .pipe(output)
```

> **🎭 PLAY**  
> Try to execute these example and understand better how they work.


## 05.3 Error handling and pipeline

`.pipe` is amazing, but it's not perfect. In fact, there's a very important and dangerous shortcoming with it: error handling!

To understand what I mean here, let's get back to our example of a multi-step pipeline:

```javascript
readableFileStream
  .pipe(decompressStream)
  .pipe(decryptStream)
  .pipe(convertStream)
  .pipe(encryptStream)
  .pipe(compressStream)
  .pipe(writableFileStream)
```

We said that every time we call `.pipe`, it will return a new instance of a stream. This means that if we want to handle errors in every step (AS WE SHOULD!), we have to do something like this:

```javascript

readableFileStream
  .on('error', handleErr)
  .pipe(decompressStream)
  .on('error', handleErr)
  .pipe(decryptStream)
  .on('error', handleErr)
  .pipe(convertStream)
  .on('error', handleErr)
  .pipe(encryptStream)
  .on('error', handleErr)
  .pipe(compressStream)
  .on('error', handleErr)
  .pipe(writableFileStream)
  .on('error', handleErr)

function handleError (err) {
  // ... print the error and destroy all the streams to avoid leaking resources and memory
  console.error(err)
  readableFileStream.destroy()
  decompressStream.destroy()
  decryptStream.destroy()
  convertStream.destroy()
  encryptStream.destroy()
  compressStream.destroy()
  writableFileStream.destroy()
}
```

This is extremely verbose and annoying, right? Thankfully Node.js gives us a utility that allows us to simplify this code.

The utility is called [`stream.pipeline`](https://nodejs.org/api/stream.html#stream_stream_pipeline_streams_callback) and it's a function with the following signature:

```javascript
stream.pipeline(...streams, callback)
```

We can pass an arbitrary number of streams followed by a callback function. The streams get piped in order and the callback is called when all the processing is done or in case there's an error. If there's an error all the streams are properly ended and destroyed for you. So with this utility we could rewrite our previous example as follows:

```javascript
import { pipeline } from 'stream'

pipeline(
  readableFileStream,
  decompressStream,
  decryptStream,
  convertStream,
  encryptStream,
  compressStream,
  writableFileStream,
  (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('Processing completed successfully')
    }
  }
)
```

> **🎭 PLAY**  
> Try to rewrite one of the examples above using `stream.pipeline`, rather than `.pipe`

**Note**: `stream.pipeline` is available only from Node.js 10, so if you are using an earlier version of Node.js or if you are not sure in which environment your code is going to run, you can use the NPM module [`pump`](http://npm.im/pump), which does exactly what pipeline does.

> **✏️ TIP**
>
> In Node.js v15.0.0 you can also use a variation of `pipeline` (from the `stream/promises` package) that returns a `Promise`, which is ideal when you are using `async/await`:
>
> ```javascript
> import { pipeline } from 'stream/promises'
>
> // ... in a given async function
> try {
>   await pipeline(
>     readableStream,
>     transformStream,
>     writableStream,
>   )
> } catch (err) {
>   // handle errors
> }
> ```


## 05.4 Composability and `pumpify`

At this point you should have realized that Node.js streams have the property of being very *composable*. In fact, you can generally see the source Readable stream as the *input*, the chain of Transform streams as *business logic* and the Writable stream as an *output*. With this mindset, you will end up focusing on your Transform streams most of the time and swap different implementations of input and output if needed.

For instance, you might work on a plain script and use files as input and output. Later, you might want to turn a simple script into a more sophisticated CLI utility and at that point it might make more sense to consume data from standard input (`process.stdin`) and emit the data in the standard output (`process.stdout`). Eventually, you might even want to build a web server that exposes the same business logic, so your input will become the HTTP request and your output the HTTP response.

In all these cases, you don't have to change your Transform streams, but just use different instances of the source Readable stream and the destination Writable stream.

But what if our business logic is made of several Transform streams chained together and we want to expose those as a separate module independent from the Readable source and the Writable destination?

In those cases you can use the module [`pumpify`](http://npm.im/pumpify) from NPM, which you can use as follows:

```javascript
import pumpify from 'pumpify'

// ... create all the stream instances here

const myTransformPipeline = pumpify(
  decompressStream,
  decryptStream,
  convertStream,
  encryptStream,
  compressStream
)

export default myTransformPipeline
```

The great thing about `pumpify` is that, if one of the streams closes or generates an error,
all the streams in the pipeline will be destroyed.

> **🏹 Exercise** ([encgz.js](/05-pipes/exercises/encgz.js))
>
> Use `pumpify` to create two functions that generate Transform streams.
>
> - The first function generates a Transform stream that encrypts the
> incoming data using the "aes256" algorithm and then compresses the resulting
> data using gzip.
> - The second function generates a Transform stream that decompress the
> incoming data using gunzip, and then decrypts the data using the "aes256"
> algorithm
>
> A skeleton of the file is available at `05-pipes/exercises/encgz.js`.
>
> You can edit the file and run an interactive test session to validate your implementation with:
>
> ```bash
> npm run ex -- 05-pipes/exercises/encgz.test.js
> ```
>
> If you really struggle with this, you can have a look at [`encgz.solution.js`](/05-pipes/exercises/encgz.solution.js) for a possible solution.


## 05.5 Summary

This is probably one of the most important sections about Node.js streams. Once
you understand how to combine streams and create pipelines, you now have a new
great power at your disposal for efficient data processing.

In the next chapter we will expand our set of skill by learning how to [create custom streams](/06-custom-streams/README.md).
Are you ready for it? 😛


---

| [⬅️ 04 - Transform streams](/04-transform-streams/README.md) | [🏠](/README.md)| [06 - Custom Streams ➡️](/06-custom-streams/README.md)|
|:--------------|:------:|------------------------------------------------:|
