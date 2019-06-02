# 02 - Readable Streams

- [02.1 What is a Readable stream](#021-what-is-a-readable-stream)
- [02.2 Flowing mode](#022-flowing-mode)


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

...



---

| [⬅️ 01 - Buffer vs Stream](/01-buffer-vs-stream/README.md) | [🏠](/README.md)| [03 - Writable Streams ➡️](/03-writable-streams/README.md)|
|:--------------|:------:|------------------------------------------------:|
