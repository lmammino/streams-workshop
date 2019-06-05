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

...

---

| [⬅️ 04 - Transform streams](/04-transform-streams/README.md) | [🏠](/README.md)| [06 - Custom Streams ➡️](/06-custom-streams/README.md)|
|:--------------|:------:|------------------------------------------------:|
