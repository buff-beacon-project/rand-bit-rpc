import { readFileSync } from 'fs'
import { createClient } from './client.js'
import crypto from 'crypto'
import { decryptResult, unserializeEncryptedData } from './rng-results.js'

const delay = dt => new Promise(resolve => setTimeout(resolve, dt))

async function run(dialTo, dialerKeys) {
  const client = await createClient(dialTo, dialerKeys)

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
  })

  const pk = publicKey.export({ format: 'pem', type: 'spki' })

  async function fetch(){
    try {
      const res = await client.send('fetch', {})
      const payload = res.payload
      console.log(payload)
      if (payload.status === 'READY'){
        console.log(`Got data (len: ${payload.result.length})`, payload.result.substring(0, 64) + '...')
        const result = await decryptResult(privateKey, unserializeEncryptedData(Buffer.from(payload.result, 'base64')))
        console.log('Decoded result', result)
        console.log('Restarting')
        const ret = await client.send('start', { pk })
        console.log(ret.payload)
        return ret.payload.eta
      } else if (payload.status === 'STALE' || payload.status === 'EMPTY'){
        console.log('Restarting')
        const ret = await client.send('start', { pk })
        console.log(ret.payload)
        return ret.payload.eta
      }
      return payload.next_update
    } catch(e){
      console.error('in fetch', e)
    }
  }

  while (true) {
    const eta = await fetch()
    if (eta){
      const dt = Math.max(1000, new Date(eta).getTime() - Date.now())
      console.log(`waiting ${dt}ms`)
      await delay(dt)
    } else {
      console.log('waiting 1s')
      await delay(1000)
    }
  }
}

const args = process.argv.slice(2)
const address = args[0]
const keys = JSON.parse(readFileSync(args[1] || 'private-keys.json'))

await run(
  address,
  keys
)
