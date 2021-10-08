export default `
message BitBox {
  string id = 1;
  string status = 2;
  string pk = 3;
  uint32 priority = 4;
  uint32 refill_rate_limit = 5;
  string last_updated = 6;
  string next_update = 7;
  uint32 nbits = 8;
  string seed = 9;
  bytes result = 10;
  bytes signature = 11;
}
`
