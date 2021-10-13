import { root, RPCMessage } from './types/index.js'

export function encodePayload(payloadType, payload){
  if (!payloadType){ return {} }
  const type = root.lookupType(payloadType)
  const message = type.fromObject(payload)
  const encoded = type.encode(message).finish()
  return { type_url: payloadType, value: encoded }
}

export function encodeRequest(id, command, payloadType, payload) {
  const request = RPCMessage.create({
    id,
    timestamp: Date.now(),
    type: 'REQUEST',
    status: 'OK',
    command,
    payload: encodePayload(payloadType, payload)
  })

  return RPCMessage.encode(request).finish()
}

export function encodeResponse(request, payloadType, payload) {
  const status = payloadType === 'ErrorResponse' ? 'ERROR' : 'OK'

  RPCMessage.create({
    id: request.id,
    timestamp: Date.now(),
    type: 'RESPONSE',
    status,
    command: request.command,
    payload: encodePayload(payloadType, payload)
  })

  return RPCMessage.encode(request).finish()
}

export function encodeErrorResponse(request, error) {
  return encodeResponse(request, 'ErrorResponse', {
    code: error.code || 0,
    message: error.message
  })
}

export function decode(buffer) {
  const obj = RPCMessage.toObject(RPCMessage.decode(buffer), {
    enums: String,
    json: true
  })

  const type = root.lookupType(obj.payload.type_url)
  const payload = type.toObject(type.decode(obj.payload.value), {
    enums: String,
    json: true,
  })

  obj.payload = payload
  return obj
}
