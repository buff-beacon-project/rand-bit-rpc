export default `
message EncryptedData {
  string public_key = 1;
  bytes iv = 2;
  bytes key = 3;
  bytes ciphertext = 4;
}
`
