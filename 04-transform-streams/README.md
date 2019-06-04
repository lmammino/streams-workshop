# 04 - Transform Streams

- [04.1 Duplex and Transform streams](#041-duplex-and-transform-streams)
- ...
- [04.X Summary](#04X-summary)


## 04.1 Duplex and Transform streams

Readable and Writable streams are not the only options when it comes to streaming in Node.js.

Another important type of stream is the **Duplex** stream.

A Duplex stream is essentially a stream that is both Readable and Writable. It is an ideal abstraction to represent readable and writable pipes like TCP connections.

![Duplex stream schema](./images/duplex-stream-schema.png)

(image from [codewinds.com](http://codewinds.com/blog/2013-08-31-nodejs-duplex-streams.html))

**Transform** streams are a special class of Duplex streams in which the data that is written in one end of the stream is internally modified so that it can be read in its new form on the other end. This essentially a way to be able to do in flight transformations and it's very useful in multiple cases:

 - Compression / Decompression
 - Encryption / Decryption
 - Data filtering
 - Data enrichment
 - Media transcoding

![Transform stream schema](./images/transform-stream-schema.png)

...


## 04.X Summary

...

---

| [⬅️ 03 - Writable streams](/03-writable-streams/README.md) | [🏠](/README.md)| [05 - Pipes ➡️](/05-pipes/README.md)|
|:--------------|:------:|------------------------------------------------:|
