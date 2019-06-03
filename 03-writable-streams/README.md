# 03 - Writable Streams

- [03.1 What is a Writable stream](#031-what-is-a-writable-stream)
- [03.2 Using Writable streams](#032-using-writable-streams)


## 03.1 What is a Writable stream

A Writable stream is an abstraction that allows to write data over a destination. In a way you can see Writable streams as an abstraction for output.

Some notable instances of Writable streams:

- Writing to a file with `fs.createWriteStream()`
- Command line standard output and standard error (`process.stdout`, `process.stderr`)
- An HTTP request (when sent by a client)
- An HTTP response (when sent by a server)
- AWS S3 `PutObject` (`body` parameter)


## 03.2 Using Writable streams

...

---

| [⬅️ 02 - Readable streams](/02-readable-streams/README.md) | [🏠](/README.md)| [04 - Transform Streams ➡️](/04-transform-streams/README.md)|
|:--------------|:------:|------------------------------------------------:|
