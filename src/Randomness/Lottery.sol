//THIS CONTRACT IS CONSUMING A LOT OF GAS
//THIS CONTRACT IS ONLY FOR DEMONSTRATING HOW RANDOM NUMBER CAN BE GENERATED
//DO NOT USE THIS FOR PRODUCTION

pragma solidity > 0.4.99 < 0.6.0;


contract Lottery {
    
    mapping (uint8 => address payable[]) playersByNumber ;
    mapping (address => bytes) playersHash;

    uint8[] public numbers;
    
    address payable owner;
    
    constructor() public {
        owner = msg.sender;
        state = LotteryState.FirstRound;
    }
    
    enum LotteryState { FirstRound, SecondRound, Finished }
    
    LotteryState state; 

    function enterHash(bytes memory x) public payable {
        require(state == LotteryState.FirstRound);
        require(msg.value > .001 ether);
        playersHash[msg.sender] = x;
    }

    function runSecondRound() public {
        require(msg.sender == owner);
        require(state == LotteryState.FirstRound);
        state = LotteryState.SecondRound;
    }
    
    function enterNumber(uint8 number) public {
        require(number<=250);
        require(state == LotteryState.SecondRound);
        bytes memory claim = abi.encodePacked(number, msg.sender);
        bytes memory commit = playersHash[msg.sender]; 
        require(sha256(commit) == sha256(claim));
        playersByNumber[number].push(msg.sender);
        numbers.push(number);
    }
    
    function determineWinner() public {
        require(msg.sender == owner);
        
        state = LotteryState.Finished;
        
        uint8 winningNumber = random();
        
        distributeFunds(winningNumber);

        selfdestruct(owner);
    }
    
    function distributeFunds(uint8 winningNumber) private returns(uint256) {
        uint256 winnerCount = playersByNumber[winningNumber].length;
        require(winnerCount == 1);
        
        if (winnerCount > 0) {
            uint256 balanceToDistribute = address(this).balance/(2*winnerCount);
            for (uint i = 0; i<winnerCount; i++) {
                require(i==0);
                playersByNumber[winningNumber][i].transfer(balanceToDistribute);
            }
        }
        
        return address(this).balance;
    }
    
    function random() private view returns (uint8) {
        uint8 randomNumber = numbers[0];
        for (uint8 i = 1; i < numbers.length; ++i) {
            randomNumber ^= numbers[i];
        }
        return randomNumber;
    }
}
