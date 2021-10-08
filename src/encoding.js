import { root, RPCMessage } from './types/index.js'
import { v4 as uuid } from 'uuid'

export function encodeRequest(command, payloadType, payload) {
  const type = root.lookupType(payloadType)
  const message = type.fromObject(payload)
  const encoded = type.encode(message).finish()

  const id = uuid()
  const request = RPCMessage.create({
    id,
    timestamp: Date.now(),
    type: 'REQUEST',
    status: 'OK',
    command,
    payload: { type_url: payloadType, value: encoded }
  })

  return RPCMessage.encodeDelimited(request).finish()
}

export function encodeResponse(request, payloadType, payload) {
  const type = root.lookupType(payloadType)
  const message = type.fromObject(payload)
  const encoded = type.encode(message).finish()
  const status = payloadType === 'ErrorResponse' ? 'ERROR' : 'OK'

  RPCMessage.create({
    id: request.id,
    timestamp: Date.now(),
    type: 'RESPONSE',
    status,
    command: request.command,
    payload: { type_url: payloadType, value: encoded }
  })

  return RPCMessage.encodeDelimited(request).finish()
}

export function encodeErrorResponse(request, error) {
  return encodeResponse(request, 'ErrorResponse', {
    code: error.code || 0,
    message: error.message
  })
}

export function decode(buffer) {
  return RPCMessage.toObject(RPCMessage.decodeDelimited(buffer), {
    enums: String,
    json: true
  })
}
