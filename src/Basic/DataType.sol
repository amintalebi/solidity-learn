pragma solidity >=0.4.22 <0.6.0;


contract DataTypes {
  // uint used for currency amount (there are no doubles or floats) and for dates (in unix time)
  uint x;

  // int of 256 bit, cannot be changed after instantiation
  int constant a = 8;
  // same affect as line above, here the 256 is explicit
  int256 constant b = 8;
  // a hex constant
  uint constant VERSION_ID = 0x123A1;

  // For int and uint, can explicitly set space in steps of 8 up to 256; e.g. int8, int16, int24
  uint8 c;
  int64 d;
  uint248 e;

  // be careful that you don't overflow, and protect against attacks that do
  // no random function built in, use other contracts for randomness
  
  // Type casting
  int f = int(b);

  bool g = true; // or do 'var b = true;' for inferred typing

  // Addresses - Holds 20 byte/160 bit Ethereum addresses
  // No arithmetic allowed
  address payable h = address(0x123);
  address myAddress = address(this);
  // It is possible to query the balance of an address using the property balance and
  // to send Ether (in units of wei) to a payable address using the transfer function

  function func() public returns (bool) {
    if (h.balance < 10 && myAddress.balance >= 10)
      h.transfer(10);
    return false;
  }


  // same as bytes, but does not allow lenght or access (for now)
  string n = "hello";
  // stored in UTF-8, note double quotes, not single
  // prefer bytes32/bytes, as UTF-8 uses more storage
  




}
