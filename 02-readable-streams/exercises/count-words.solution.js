export default async function countWords (srcStream) {
  let numWords = 0
  let lastWordFromPreviousChunk = ''

  for await (const chunk of srcStream) {
    const words = (lastWordFromPreviousChunk + chunk.toString()).split(/\s+/)
    lastWordFromPreviousChunk = words.pop()

    numWords += words.length
  }

  return numWords
}
