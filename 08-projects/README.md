# 08 - Projects

In this last section you will find some ideas of small projects you can build to practice your Node.js streams skills.

 - [08.1 - ✏️ Project: Data compression efficiency](#081---️-project-data-compression-efficiency)
 - [08.2 - ✏️ Project: Emoji moon phases animation over HTTP](#082---️-project-emoji-moon-phases-animation-over-http)
 - [08.3 - ✏️ Project: Static files web server with built-in compression](#083---️-project-static-files-web-server-with-built-in-compression)
 - [08.4 - ✏️ Project: Streaming data processing](#084---️-project-streaming-data-processing)
 - [08.5 - ✏️ Project: Files archive](#085---️-project-files-archive)
 - [08.6 - ✏️ Project: Encrypted file share over TCP](#086---️-project-encrypted-file-share-over-tcp)
 - [08.7 Where to go from here](#087-where-to-go-from-here)


## 08.1 - ✏️ Project: Data compression efficiency

Write a CLI script that takes some data from a file or from the standard input and compresses it into files using different algorithms from the ones available in the `zlib` package and then tells you which one is the more efficient and what's the compression ratio.


## 08.2 - ✏️ Project: Emoji moon phases animation over HTTP

Did you know about [parrot.live](http://parrot.live)? NO?!?! Try to run this right now:

```bash
curl parrot.live
```

Isn't this the coolest thing ever!?
It happens that this is built in Node.js and (surprise) with a very clever use of streams.

The code is open source, so, if you are curious, you should [have a look](https://github.com/hugomd/parrot.live), because now it's your turn to implement some funkiness like this.

This time you might want to do this by animating emojis with lunar phases:

🌕 🌖 🌗 🌘 🌑 🌒 🌓 🌔

Don't you wonder what kind of cool effect would that create?


## 08.3 - ✏️ Project: Static files web server with built-in compression

Build a web server that allows you to serve static files from a folder in the local system.

Did you ever heard of the [`Accept-Encoding` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)? Well, if not, you probably just need to know that it allows a client to specify what kind of compression it prefers.

Make sure your web server reads this header and serves the file compressed in the expected format.

You could use the [`accepts` npm package](https://www.npmjs.com/package/accepts) to simplify the content negotiation part.


## 08.4 - ✏️ Project: Streaming data processing

On Kaggle you can find a lot of interesting data sets, like the [London Crime Data](https://www.kaggle.com/jboysen/london-crime/).

You can [download the data in csv format](https://www.kaggle.com/jboysen/london-crime/downloads/london-crime.zip/1) and build a stream processing script that analyses the data and tries to answer the following questions:

- Did the number of crimes go up or down over the years?
- What are the most dangerous areas of London?
- What is the most common crime per area?
- What is the least common crime?

Bonus points if you start the processing directly on the zipped file to save disk space :)


## 08.5 - ✏️ Project: Files archive

Did you ever wonder how [**tar** archive file format](https://en.wikipedia.org/wiki/Tar_(computing)) works?

Essentially it allows you to combine multiple files into one. Without looking at the actual file format for tar, can you build a CLI utility that allows you to pass many files as input and get back a single file that combines them all together?

Can you also build the CLI utility to unpack all the files from the archive?


## 08.6 - ✏️ Project: Encrypted file share over TCP

Build a client and a server to transfer files over TCP. Extra point if you add a layer of encryption. Once you have your implementation ready, give the client code to a friend or a colleague and give them your IP address, then ask them to send you a file!

To learn how to create TCP clients and servers check out the documentation of the built-in [`net` module](https://nodejs.org/api/net.html#net_class_net_server).


## 08.7 Where to go from here

I hope you had fun with this workshop and that you also acquired some new practical learnings that you can bring to your next project.

If you want to keep learning about Node.js streams and stream processing in general, these are some interesting books:

 - [Node.js Design Patterns, Second Edition](http://amzn.to/2bB58Ic): has an entire chapter dedicated to streams and related design patterns (this is my book!)
 - [Node Cookbook](https://www.packtpub.com/web-development/node-cookbook-third-edition): a great book with a lot of advices to get your Node.js more production ready, including one entire chapter dedicated to streams.
 - [Streaming Systems](http://streamingsystems.net/): a non-Node.js book that goes in depth about the challenges of building stream processing systems. Great if you want to understand more about the broader topic of distributed stream processing.

Let me know what you are going to build with your new stream knowledge on [Twitter](https://twitter.com/loige) and if you have some spare minutes, please fill [**my feedback form**](https://loige.link/streams-workshop-feedback) :)

Thank you! 👋

---

| [⬅️ 07 - Stream patterns](/07-stream-patterns/README.md) | [🏠](/README.md)| - |
|:--------------|:------:|------------------------------------------------:|
