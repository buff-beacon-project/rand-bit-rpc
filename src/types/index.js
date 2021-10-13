import protobufjs from 'protobufjs'
import rpcMessage from './rpc-message.js'
import errorResponse from './error-response.js'
import notification from './notification.js'
import bitbox from './bitbox.js'
import encryptedData from './encrypted-data.js'
import resultContent from './result-content.js'
import startCommand from './start-command.js'

const Any = new protobufjs.Type('Any')
  .add(new protobufjs.Field('type_url', 1, 'string'))
  .add(new protobufjs.Field('value', 2, 'bytes'))

export const root = new protobufjs.Root()
root.define('google.protobuf').add(Any)
protobufjs.parse([
  'syntax = "proto3";',
  // 'import "google/protobuf/any.proto";',
  rpcMessage,
  errorResponse,
  notification,
  bitbox,
  encryptedData,
  resultContent,
  startCommand
].join('\n'), root)

export const RPCMessage = root.lookupType('RPCMessage')
export const ErrorResponse = root.lookupType('ErrorResponse')
export const Notification = root.lookupType('Notification')
export const BitBox = root.lookupType('BitBox')
export const ResultContent = root.lookupType('ResultContent')
export const EncryptedData = root.lookupType('EncryptedData')
