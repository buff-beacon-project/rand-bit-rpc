export default `
message RPCMessage {
  string id = 1;
  uint32 timestamp = 2;
  enum RPCType {
    REQUEST = 0;
    RESPONSE = 1;
  }
  RPCType type = 3;
  enum RPCStatus {
    OK = 0;
    ERROR = 1;
  }
  RPCStatus status = 4;
  string command = 5;
  google.protobuf.Any payload = 6;
}
`
