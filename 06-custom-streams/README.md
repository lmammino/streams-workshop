# 06 - Custom Streams

- [06.1 The `readable-stream` module](#061-the-readable-stream-module)
- [06.2 Custom Readable streams](#062-custom-readable-streams)
- [06.3 Custom Transform streams](#063-custom-transform-streams)
- [06.4 Custom Writable streams](#064-custom-writable-streams)
- [06.5 Conclusion](#065-conclusion)


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

Creating custom Transform streams is unsurprisingly similar to creating custom Readable streams. Also in this case it's just a matter of extending the `Transform` class. This time though, we have to implement the `_tranform` method which accepts 3 arguments:

 - `chunk`: the current chunk of data to transform
 - `enc`: a string that represents the current encoding of the data
 - `cb`: a callback to invoke when the transformation is done. This allows you to have asynchronous transformations.

Custom Transform streams can be very useful in a variety of situations, and they are probably the most common types of custom streams you will be writing in real life.

Just to give you some ideas of possible cases where it could make sense to implement custom Transform streams, here's a list:

 - Convert the data from one format to another, for instance make a text uppercase;
 - Filter the incoming data and ignore chunks that are not relevant, for instance ignore all the negative numbers, push all the others;
 - Stringify objects in an object stream so that they can be piped to a file or the standard output.

Let's actually see how to implement the uppercasify stream:

```javascript
// uppercasify.js

const { Transform } = require('readable-stream')

class Uppercasify extends Transform {
  _transform (chunk, encoding, done) {
    this.push(chunk.toString().toUpperCase())
    done()
  }
}

module.exports = Uppercasify
```

That was easy! 😎

Sometimes though, Transform streams might get a little bit more complicated as you might have to accumulate some data across chunks, before you have enough information to be able to transform the data. This is common with tasks like encryption or compression where the size of the incoming data doesn't necessarily match the size of the outgoing data, so you might need to buffer some data for a while before being able to emit a fully transformed chunk.

This problem might also present itself in (apparently) simpler cases. For instance, let's imagine we want to write a Transform stream that gets arbitrary text in, but pushes individual words out. This kind of stream will essentially allow us to consume pieces of texts word by word. This is a great primitive if you want to create a program that can extract the most common words out of a text.

Why is this tricky? Because chunks are emitted once an arbitrary amount of bytes is reached, there's no semantic about individual words, so you might end up with a truncated word at the end of any given chunk. How do you solve this?

One way to address this challenge might be to take all the words in the current chunk and push them out, except the last one (as this might be truncated). We have to retain the last word and wait for the next chunk. Once the next chunk arrives we can prepand the remainder word from the previous chunk to the new one.

This approach makes sense and it should work, but there's still a problem. Once the source stream is over, you might still have data buffered from the last chunk. How do we emit that?

Thankfully, the `Transform` class gives us a way to deal with these cases, the `_flush()` method. This method is called every time the source stream is finished and before the Transform stream gets closed as well. So it's the perfect place to flush remanining data.

With these new ideas in mind let's see a possible implementation for the `WordsStream`:

```javascript
// words-stream.js

const { Transform } = require('readable-stream')

class WordsStream extends Transform {
  constructor (options) {
    super(options)
    this.lastWord = ''
  }

  _transform (chunk, enc, cb) {
    // prepends the last word to the new data
    const newData = this.lastWord + chunk.toString()
    const words = newData.split(/[\s,.;:]+/)

    // removes the last word in the chunk
    this.lastWord = words.pop()

    // emit every single word remaining in the array
    for (let word of words) {
      this.push(word)
    }

    cb()
  }

  _flush (cb) {
    if (this.lastWord) {
      this.push(this.lastWord)
    }

    cb()
  }
}

module.exports = WordsStream
```

We can play with this stream with the following script:

```javascript
// use-words-stream.js

const WordsStream = require('./words-stream')

const wordsStream = new WordsStream()

process.stdin
  .pipe(wordsStream)
  .pipe(process.stdout)
```

If we run this script as follows:

```bash
node use-words-stream < README.md
```

You will see that the output will look more or less like this:

> #06-CustomStreams-\[061The\`readable-stream\`module\](#061-the-readable-stream-module)-\[062CustomReadablestreams\](#062-custom-readable-streams)-\[063CustomTransformstreams\](#063-custom-transform-streams)-\[064CustomWritablestreams\](#064-custom-writable-streams)-\[065Streamsinthebrowser\](#065-streams-in-the-browser)-\[066Conclusion\](#066-conclusion)##061The\`readable-stream\`moduleAveryusefulmodulefromNPMwhenitcomestowritecustomstreamsis\[\`readable-stream\`\](http//npmim/readable-stream)ThismodulecontainsacopyofthelatestversionofNodejsstreamlibrarythiswayyoucanalwaysusethelateststreamfeaturesregardlessofwhatversionofNodejsisrunningyourcodeThisalsohelpsmakingstreambehaviorsalittlebitmorestableandpredictableastherehavebeenseveralchangesinthelibraryovertheyearsThenameisactuallyabitmisleadingasthemodulecontainsallthecodefromthenative\`stream\`modulenotjustthepartrelatedtoReadablestreamsAnotherinterestingpropertyofthismoduleisthatitmakesNodejsstreamscompatiblewiththebrowserwhichmeansthatyoucanusemodulebundlerssuchasWebpackandBroswserifytoobtainJavaScriptcodeusingstreamsthatcanruninthebrowserSofromnowonwearegoingtoreplaceallthe...

Essentially, just pushing all the chunks blindly to the standard output concatenates all of them together!

Ideally we would need another Transform stream piped before the standard output that can add a separator, for instance a new line, to the current chunk.

TODO add exercise about separator stream

TODO add short version of Transform stream with new Transform

TODO add exercise about jsonify stream


## 06.4 Custom Writable streams

...


## 06.5 Conclusion

...

---

| [⬅️ 05 - Pipes](/05-pipes/README.md) | [🏠](/README.md)| [07 - Streams in the browser ➡️](/07-streams-in-the-browser/README.md)|
|:--------------|:------:|------------------------------------------------:|
