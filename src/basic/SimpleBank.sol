pragma solidity >=0.4.22 <0.6.0;


contract SimpleBank {
    mapping(address => uint) private balances;
    address public owner;
    event LogDepositMode(address accountAddress, uint amount);

    constructor () public {
        owner = msg.sender;
    }

    function deposit() public payable returns (uint) {
        balances[msg.sender] += msg.value;
        emit LogDepositMode(msg.sender, msg.value);
        return balances[msg.sender];
    }

    function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
        if (balances[msg.sender] >= withdrawAmount) {
            balances[msg.sender] -= withdrawAmount;
            if (!msg.sender.send(withdrawAmount)) {
                balances[msg.sender] += withdrawAmount;
            }
        }
        return balances[msg.sender];
    }
    
    function balance() public view returns (uint) {
        return  balances[msg.sender];
    }

    function () external {
        revert("I am fallback function");
    }
    
}


