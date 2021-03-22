export default async function countWords (srcStream) {
  srcStream.setEncoding('utf8') // makes sure we process this as text (avoids multi-bytes errors)

  let numWords = 0
  let lastWordFromPreviousChunk = ''

  for await (const chunk of srcStream) {
    const words = (lastWordFromPreviousChunk + chunk.toString()).split(/\s+/)
    lastWordFromPreviousChunk = words.pop()

    numWords += words.length
  }

  // at the end of the loop we might still have some data
  // to process in our lastWordFromPreviousChunk
  if (lastWordFromPreviousChunk) {
    numWords += lastWordFromPreviousChunk.split(/\s+/).length
  }

  return numWords
}
