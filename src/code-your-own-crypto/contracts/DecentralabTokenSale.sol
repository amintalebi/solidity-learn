pragma solidity > 0.4.99 < 0.6.0;

import "./DecentralabToken.sol";

contract DecentralabTokenSale {
    address payable admin;
    DecentralabToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;


    event Sell(
        address indexed _buyer,
        uint256 _amount
    );

    constructor (DecentralabToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }


    function safeMult(uint x, uint y) internal pure returns(uint z) {
        require(y == 0 || (z = x * y) / y == x, "");
    } 

    function buyToken(uint256 _numberOfTokens) public payable {
        require(safeMult(_numberOfTokens, tokenPrice) == msg.value, "msg.value is not enough");
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "not enough tokens");
        require(tokenContract.transfer(msg.sender, _numberOfTokens), "token transfer was not successful");

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    
    function endSale() public {
        require(msg.sender == admin, "not admin");
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))), "returning tokens was not successful");
        selfdestruct(admin);
    }

}
