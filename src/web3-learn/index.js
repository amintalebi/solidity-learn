let Web3 = require('web3');

// Ethereum Main Network
const url = 'http://127.0.0.1:8545';

let web3 = new Web3(url);


const abi = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "DepositFunds",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "TransactionCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "TransactionCompleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "by",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "TransactionSigned",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getName",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "addOwner",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "existingOwner",
          "type": "address"
        }
      ],
      "name": "removeOwner",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferTo",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getPendingTransactions",
      "outputs": [
        {
          "name": "",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "transactionId",
          "type": "uint256"
        }
      ],
      "name": "signTransaction",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "transactionId",          
          "type": "uint256"
        }
      ],
      "name": "deleteTransaction",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "walletBallance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

const address = '0x48e9D2e548cE8A81a570E9b5891d9cc22db642aF';

let contract = web3.eth.Contract(abi, address);


contract.methods.getName().call().then((name) => {
    console.log(name);
});

const callback = (err, res) => { 
  console.log(res);
};

const accounts = ["0x3085d38474891e2c9ffdd1fa8bf4673f99baec9d",
                  "0x9bef90e9d171bd105a29c8f54f8289f101187263",
                  "0x4c53c6292c2acee21ac5fd097432f6cb6c4926df",
                  "0xad416867ec91274d41298e5c6b9cfa63b37aa51b"];

web3.eth.sendTransaction({from: account1, to:account2, value: web3.utils.toWei('1', 'ether')},
  (err, transactionHash) => {
    if (!err) {
      console.log(transactionHash + " success");
      web3.eth.getBalance(account1, callback);
      web3.eth.getBalance(account2, callback);
    }
  }  
);












