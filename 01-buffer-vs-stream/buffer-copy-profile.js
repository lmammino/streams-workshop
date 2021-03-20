import {
  readFile,
  writeFile
} from 'fs/promises'

const profile = setInterval(() => {
  console.error(`${(process.memoryUsage().arrayBuffers / 1024 / 1024).toFixed(4).padStart(10)} Mb`)
}, 100)

async function copyFile (src, dest) {
  // read entire file content
  const content = await readFile(src)
  // write that content somewhere else
  return writeFile(dest, content)
}

// `src` is the first argument from cli, `dest` the second
const [,, src, dest] = process.argv

// start the copy and handle the result
copyFile(src, dest)
  .then(() => {
    console.log(`${src} copied into ${dest}`)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => clearInterval(profile))
