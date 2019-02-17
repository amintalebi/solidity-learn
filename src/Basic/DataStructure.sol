pragma solidity >=0.4.22 <0.6.0;

contract DataStructure {
    // Array
    bytes32[5] nicknames; // static array
    bytes32[] names; // dynamic array

    uint newLength = names.push("Amin"); // adding returns new length of the array

    // Mapping (any type to any other type)

    mapping(string => uint) balances;

    // Mapping can be nested 
    mapping(string => mapping(address => uint)) nested;

    function map(string memory name) public {
        balances[name] = 1;
    }

    // Struct
    struct Bank {
        address owner;
        uint balance;
    }

    Bank b = Bank({
        owner: msg.sender,
        balance: 5
    });

    // or
    Bank c = Bank(msg.sender, 5);


    // Enum
    enum State { 
        Created,
        Locked,
        Inactive
    }

    State public state;

    function f() public {
        state = State.Created;        
    }

}