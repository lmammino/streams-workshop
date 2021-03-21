# 04 - Transform Streams

- [04.1 Duplex and Transform streams](#041-duplex-and-transform-streams)
- [04.2 Using Transform streams](#042-using-transform-streams)
- [04.3 Summary](#043-summary)


## 04.1 Duplex and Transform streams

Readable and Writable streams are not the only options when it comes to streaming in Node.js.

Another important type of stream is the **Duplex** stream.

A Duplex stream is essentially a stream that is both Readable and Writable. It is an ideal abstraction to represent readable and writable pipes like TCP connections.

![Duplex stream schema](./images/duplex-stream-schema.png)

**Transform** streams are a special class of Duplex streams in which the data that is written in one end of the stream is internally modified so that it can be read in its new form on the other end. This essentially a way to be able to do in flight transformations and it's very useful in multiple cases:

 - Compression / Decompression
 - Encryption / Decryption
 - Data filtering and aggregation
 - Data enrichment
 - Media transcoding

![Transform stream schema](./images/transform-stream-schema.png)

It might be easier to appreciate this idea with an animated image:

![Transform stream animation](./images/transform-stream-animation.gif)

Of course, consider that this is done continuously on every chunk, so the flux of data is constantly transformed as more data arrives.


## 04.2 Using Transform streams

A very good example for Transform streams is gzipping. Imagine we want to convert our copy file utility into an "archive" file utility, where, in order to save space, the file gets compressed while copied to the end destination.

How could we do that?

Well at this point this is what we know:

 - Transform streams are both Readable and Writable
 - We know how to use Readable and Writable streams through events

So given a source stream and a destination stream we should be able to write a copy and gzip script, right?

Ok, before trying to write any code, let's try to visualize the problem for a moment and understand what kind of events we have to deal with and how should we tie all of them together:

![Transform stream events animation](./images/transform-stream-events.gif)

Ok, there's a lot happening here. Let's discuss this animation together:

 - The first thing to notice is that we have 3 stream instances: a Readable source, a Transform stream that alters the data, and a Writable stream that receives the modified data.
 - In order to make the data flow between those 3 we need to:
   - Listen for `data` events on the Readable and write every new chunk on the Transform stream.
   - We have to do the same for the Transform stream. In order to propagate the data to the Writable: we listen for `data` events on the Transform stream and we write every new chunk to the Writable.
 - But well, we also have to handle backpressure, right? So we do that on both the Transform stream and the Writable stream.

This got complicated very fast! ... And by the way, we are not even discussing here the `end` events to close all the streams properly or how to handle errors!

Ok, let's now try to write some code down for all of this stuff:

```javascript
// stream-copy-gzip

const {
  createReadStream,
  createWriteStream
} = require('fs')
const { createGzip } = require('zlib')

const [, , src, dest] = process.argv
const srcStream = createReadStream(src)
const gzipStream = createGzip()
const destStream = createWriteStream(dest)

srcStream.on('data', data => {
  const canContinue = gzipStream.write(data)
  if (!canContinue) {
    srcStream.pause()
    gzipStream.once('drain', () => {
      srcStream.resume()
    })
  }
})

srcStream.on('end', () => {
  // check if there's buffered data left within
  // the transform stream and force push it
  const remainingData = gzipStream.read()
  if (remainingData !== null) {
    destStream.write(remainingData)
  }
  gzipStream.end()
})

gzipStream.on('data', data => {
  const canContinue = destStream.write(data)
  if (!canContinue) {
    gzipStream.pause()
    destStream.once('drain', () => {
      gzipStream.resume()
    })
  }
})

gzipStream.on('end', () => {
  destStream.end()
})

// ⚠️ TODO: handle errors!
```

Yep! This is definitely a lot of code, don't worry to much about trying to understand this... To be honest with you, I am not even sure this is entirely correct, so please don't try to run the example just to tell me it doesn't fully work!

Let's move on!

Ok, but what's the point here?

Well, I hope you get a rough idea on how Transform streams work internally and how the data flows when you use them in combination with Readable and Writable streams.

I promise you will never have to write all this complicate and error-prone code. In fact, in the next chapter we will see how to reduce all this complexity to exactly 1 line of code by using `.pipe()`. Hold tight!


## 04.3 Summary

This wasn't a very interactive chapter and hope you didn't get bored!

I hope you are now understanding the basic idea of a Transform stream as we will use it more in the next sections.

Now get ready to move to the [next chapter](/05-pipes/README.md) and do some "piping"!


---

| [⬅️ 03 - Writable streams](/03-writable-streams/README.md) | [🏠](/README.md)| [05 - Pipes ➡️](/05-pipes/README.md)|
|:--------------|:------:|------------------------------------------------:|
