// 'use strict'

// const { Transform } = require('readable-stream')

// /**
//  * Implement a Transform stream that takes the current chunk and add to it a
//  * separator before pushing it through the pipeline. This stream can be useful
//  * to make chunks more visible when piping the output of a pipeline to the
//  * standard output. Make the separator sequence configurable as first parameter
//  * of your stream constructor.
//  */
// class SeparatorStream extends Transform {
//   constructor (separator = '\n', options = {}) {
//     super(options)
//     // initialize here ...
//   }

//   _transform (chunk, enc, cb) {
//     // Add here the logic for your transform ...
//   }
// }

// module.exports = SeparatorStream
