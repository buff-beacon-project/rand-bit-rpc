import protobufjs from 'protobufjs'
import rpcMessage from './rpc-message.js'
import errorResponse from './error-response.js'
import encryptedData from './encrypted-data.js'
import resultContent from './result-content.js'

export const root = new protobufjs.Root()
protobufjs.parse([
  'syntax = "proto3";',
  'import "google/protobuf/any.proto";',
  rpcMessage,
  errorResponse,
  encryptedData,
  resultContent
].join('\n'), root)

export const RPCMessage = root.lookupType('RPCMessage')
export const ErrorResponse = root.lookupType('ErrorResponse')
export const ResultContent = root.lookupType('ResultContent')
export const EncryptedData = root.lookupType('EncryptedData')
