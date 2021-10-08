export default `
message ResultContent {
  uint32 timestamp = 1;
  string version = 2;
  bytes value = 3;
  string certificate = 4;
  repeated double seed = 5;
  repeated double pefs = 6;
  repeated double extractor_params = 7;
  bytes raw = 8;
}
`
