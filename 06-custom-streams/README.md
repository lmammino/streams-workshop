# 06 - Custom Streams

- [06.1 The `readable-stream` module](#061-the-readable-stream-module)
- [06.2 Custom Readable streams](#062-custom-readable-streams)
- [06.3 Custom Transform streams](#063-custom-transform-streams)
- [06.4 Custom Writable streams](#064-custom-writable-streams)
- [06.5 Streams in the browser](#065-streams-in-the-browser)
- [06.6 Conclusion](#066-conclusion)


## 06.1 The `readable-stream` module

A very useful module from NPM when it comes to write custom streams is [`readable-stream`](http://npm.im/readable-stream).

This module contains a copy of the latest version of Node.js stream library, this way you can always use the latest stream features regardless of what version of Node.js is running your code. This also helps making stream behaviors a little bit more stable and predictable as there have been several changes in the library over the years.

The name is actually a bit misleading, as the module contains all the code from the native `stream` module, not just the part related to Readable streams.

Another interesting property of this module is that it makes Node.js streams compatible with the browser, which means that you can use module bundlers such as Webpack and Broswserify to obtain JavaScript code using streams that can run in the browser.

So from now on, we are going to replace all the `require('stream')` with `require('readable-stream')`.


## 06.2 Custom Readable streams

Creating custom readable streams can be useful to be able to use streaming primitives to consume data from custom sources or from sources from which Node.js doesn't provide a built-in module by default.

For instance you might want to create a custom Readable stream to read a lot of data from your favorite database, or maybe you can create a readable stream that provides endless random data which might be useful for fuzzy testing, or why not, a Readable stream that allows you to consume the list of all the available emojis and their description!

Yeah, this last one sounds like fun, let's actually do this!

So to create a custom Readable stream we have to extend the `Readable` class and implement the `_read()` method, which is going to look somehow like this:

```javascript
class EmojiStream extends Readable {
  _read() {
    // ...
  }
}
```

If your stream instance is stateful you will probably have to add a constructor. If you do that make sure you add `options` as part of the accepted arguments and call `super(options)` in the constructor. This is necessary to make sure that the stream is initialized correctly and to also allow more experienced users to tweak some stream parameters.

Inside the `_read()` method, you can use `this.push(data)` to emit chunks of data (strings or buffers). You call `this.push(null)` when the stream is over.

So let's see how to implement our emoji stream:

```javascript
// emoji-stream.js

const { EMOJI_MAP } = require('emoji') // from npm
const { Readable } = require('readable-stream') // from npm

const emojis = Object.keys(EMOJI_MAP)

function getEmojiDescription (index) {
  return EMOJI_MAP[emojis[index]][1]
}

function getMessage (index) {
  return emojis[index] + ' ' + getEmojiDescription(index)
}

class EmojiStream extends Readable {
  constructor (options) {
    super(options)
    // we use this to keep track of the next emoji to emit from the emoji array
    this._index = 0
  }

  _read () {
    // if no more emojis are left, the stream is over
    if (this._index >= emojis.length) {
      return this.push(null)
    }
    // emit the current emoji
    return this.push(getMessage(this._index++))
  }
}

module.exports = EmojiStream
```

You can see how this stream works with the following snippet of code:

```javascript
// use-emoji-stream.js

const EmojiStream = require('./emoji-stream')

const emojiStream = new EmojiStream()

emojiStream.pipe(process.stdout)
```

> **🎭 PLAY**  
> Try to execute the script above. Can you guess why there's no line return between the various emojis? How could you add that?

Sometimes you need to create a once off instance of a Readable stream, so creating a whole class for it might seem like an overkill. In those cases there's a shortcut: you can instantiate a new instance of `Readable` directly and pass a method called `read()` that defines the read behavior as a constructor option.

For instance let's create a stream that outputs an endless sequence of random numbers:

```javascript
// endless-numbers.js

const { Readable } = require('readable-stream')

const endlessN = new Readable({
  read() {
    this.push(Math.random() + '\n')
  }
})

endlessN.pipe(process.stdout)
```

There's a little sweet feature of streams that I haven't mentioned yet and that's maybe a good time to explore now... Streams are not limited to emit buffers or strings, they can also emit objects!

In order to do that, you have to set the option `objectMode` to `true` from the constructor. Be careful that also all the streams you pipe to will need to have `objectMode` set to `true` for the objects to be able to flow across them. For this reason we cannot pipe a stream in object mode directly to `process.stdout`.

For instance we could build a `DateStream` that emits a new `Date` object every time we read from the stream:

```javascript
// date-stream.js

const { Readable } = require('readable-stream')

class DateStream extends Readable {
  constructor (options = {}) {
    options.objectMode = true // forces object mode
    super(options)
  }

  _read () {
    this.push(new Date())
  }
}

module.exports = DateStream
```

We will see later how to use this stream in combination with a Transform stream.


> **🏹 Exercise** ([fib-stream.js](/06-custom-streams/exercises/fib-stream.js))
>
> Implement a Readable stream that allows you to consume all numbers in the
> fibonacci sequence that are smaller than a given max number.
>
> A skeleton of the solution is available at `03-writable-streams/exercises/fib-stream.js`.
>
> You can edit the file and run an interactive test session to validate your implementation with:
>
> ```bash
> npm test -- 06-custom-streams/exercises/fib-stream.test.js
> ```
>
> If you really struggle with this, you can have a look at [`fib-stream.solution.js`](/06-custom-streams/exercises/fib-stream.solution.js) for a possible solution.


## 06.3 Custom Transform streams

...

## 06.4 Custom Writable streams

...

## 06.5 Streams in the browser

...

## 06.6 Conclusion

...

---

| [⬅️ 05 - Pipes](/05-pipes/README.md) | [🏠](/README.md)| [07 - Streams patterns ➡️](/07-stream-patterns/README.md)|
|:--------------|:------:|------------------------------------------------:|
