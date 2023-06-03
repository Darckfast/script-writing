export async function calculateFileHash(object: any) {
  const blockSize = 4 * 1024 * 1024
  const blockHashes = []

  const jsonString = JSON.stringify(object)
  const encoder = new TextEncoder()
  const data = encoder.encode(jsonString)

  const buffer = data
  const blockCount = Math.ceil(buffer.byteLength / blockSize)
  const crypto = window.crypto

  for (let i = 0; i < blockCount; i++) {
    const start = i * blockSize
    const end = Math.min((i + 1) * blockSize, buffer.byteLength)
    const blockBuffer = buffer.slice(start, end)
    const blockHash = await crypto.subtle.digest('SHA-256', blockBuffer)
    blockHashes.push(blockHash)
  }

  const concatenatedHash = await crypto.subtle.digest(
    'SHA-256',
    concatenateHashes(blockHashes)
  )
  const hashArray = Array.from(new Uint8Array(concatenatedHash))
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  return hashHex
}

function concatenateHashes(hashes) {
  const hashArray = new Uint8Array(
    hashes.reduce((acc, hash) => acc + hash.byteLength, 0)
  )
  let offset = 0

  for (const hash of hashes) {
    hashArray.set(new Uint8Array(hash), offset)
    offset += hash.byteLength
  }

  return hashArray.buffer
}
