export default `
message BitBox {
  string id = 0;
  string status = 1;
  string pk = 2;
  uint32 priority = 3;
  uint32 refill_rate_limit = 4;
  string last_updated = 5;
  string next_update = 6;
  uint32 nbits = 7;
  string seed = 8;
  bytes result = 9;
  bytes signature = 10;
}
`
