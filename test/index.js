import { encodeRequest, decode } from '../src/index.js'

const encoded = encodeRequest('1', 'command', 'Notification', { message: 'hello world' })
const msg = decode(encoded)
console.log(msg)
