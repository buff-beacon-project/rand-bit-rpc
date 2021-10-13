import { encodeRequest, encodeResponse, encodeErrorResponse, decode } from '../src/index.js'

const encoded = encodeRequest('1', 'command', 'Notification', { message: 'hello ___' })
const req = decode(encoded)
console.log(req)

const resEnc = encodeResponse(req, 'Notification', { message: 'world' })
const res = decode(resEnc)
console.log(res)

const errEnc = encodeErrorResponse(req, new Error('test'))
const errRes = decode(errEnc)
console.log(errRes)
