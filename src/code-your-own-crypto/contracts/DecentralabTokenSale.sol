pragma solidity ^0.5.1;

import "./DecentralabToken.sol";

contract DecentralabTokenSale {
    address admin;
    DecentralabToken public tokenContract;

    constructor (DecentralabToken _tokenContract) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
    }
    



}
