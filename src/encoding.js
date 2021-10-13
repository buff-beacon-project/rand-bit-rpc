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
    type: 0,
    status: 0,
    command,
    payload: encodePayload(payloadType, payload)
  })

  return RPCMessage.encode(request).finish()
}

export function encodeResponse(request, payloadType, payload) {
  const status = payloadType === 'ErrorResponse' ? 1 : 0

  const response = RPCMessage.create({
    id: request.id,
    timestamp: Date.now(),
    type: 1,
    status,
    command: request.command,
    payload: encodePayload(payloadType, payload)
  })

  return RPCMessage.encode(response).finish()
}

export function encodeErrorResponse(request, error) {
  return encodeResponse(request, 'ErrorResponse', {
    code: error.code || 0,
    message: error.message
  })
}

export function decode(buffer) {
  return RPCMessage.toObject(RPCMessage.decode(buffer), {
    enums: String,
    json: true
  })
}
