import crypto from 'libp2p-crypto'
import { publicEncrypt, privateDecrypt, constants } from 'crypto'
import { ResultContent, EncryptedData } from './types/index.js'

function encryptKey(publicKey, payload) {
  return publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(payload)
  )
}

function decryptKey(privateKey, encryptedKey) {
  return privateDecrypt(
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    encryptedKey
  )
}

export function serializeResult(result) {
  const message = ResultContent.fromObject(result)
  const bytes = ResultContent.encode(message).finish()
  return bytes
}

export function unserializeResult(buffer) {
  const message = ResultContent.decode(buffer)
  const obj = ResultContent.toObject(message)
  return obj
}

export function serializeEncryptedData(encData) {
  const message = EncryptedData.fromObject(encData)
  const bytes = EncryptedData.encode(message).finish()
  return bytes
}

export function unserializeEncryptedData(buffer) {
  const message = EncryptedData.decode(buffer)
  const obj = EncryptedData.toObject(message)
  return obj
}

export async function encryptResult(publicKey, result) {
  console.time('encrypt')
  const bytes = serializeResult(result)
  const iv = Uint8Array.from(crypto.randomBytes(16))
  const key256 = Uint8Array.from(crypto.randomBytes(32))
  const cipher = await crypto.aes.create(key256, iv)
  const ciphertext = await cipher.encrypt(bytes)
  const key = encryptKey(publicKey, key256)
  console.timeEnd('encrypt')
  return {
    publicKey,
    iv,
    key,
    ciphertext,
  }
}

export async function decryptResult(privateKey, encData) {
  const key = decryptKey(privateKey, encData.key)
  const cipher = await crypto.aes.create(key, encData.iv)
  const resultBuffer = await cipher.decrypt(encData.ciphertext)
  return unserializeResult(resultBuffer)
}
