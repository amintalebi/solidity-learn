pragma solidity > 0.4.99 < 0.6.0;


contract MultiSigWallet {
    address payable _owner;
    mapping(address => uint8) private _owners;
    string _name = "MultiSigWallet";

    uint constant MIN_SINGNATURE = 2;
    uint private _transactionIdx;

    struct Transaction {
        address payable from;
        address payable to;
        uint amount;
        uint8 singatureCount;
        mapping(address => uint8) signatures;
    }

    mapping(uint => Transaction) private _transactions;
    uint[] private _pendingTransactions;


    modifier validOwner() {
        require(_owners[msg.sender] == 1 || msg.sender == _owner);
        _;
    }

    event DepositFunds(address from, uint amount);
    event TransactionCreated(address from, address to, uint amount, uint transactionId);
    event TransactionCompleted(address from, address to, uint amount, uint transactionId);
    event TransactionSigned(address by, uint transactionId);

    constructor () public {
        _owner = msg.sender;
    }

    function getName() public view returns(string memory) {
        return _name;
    }

    function addOwner(address newOwner)
        validOwner
        public {
        _owners[newOwner] = 1;
    }

    function removeOwner(address existingOwner)
        validOwner
        public {
        _owners[existingOwner] = 0;
    }

    function ()
        external
        payable {

        emit DepositFunds(msg.sender, msg.value);
    }

    function withdraw(uint amount)
        validOwner
        public {
        require(address(this).balance >= amount);
        transferTo(msg.sender, amount);
    }

    function transferTo(address payable to, uint amount)
        validOwner
        public {
        require(address(this).balance >= amount);
        uint transactionId = _transactionIdx++;
        Transaction memory transaction;
        transaction.from = msg.sender;
        transaction.to = to;
        transaction.amount = amount;
        transaction.singatureCount = 0;


        _transactions[transactionId] = transaction;
        _pendingTransactions.push(transactionId);

        emit TransactionCreated(msg.sender, to, amount, transactionId);


    }


    function getPendingTransactions()
        validOwner
        view
        public
        returns(uint[] memory) {

        return _pendingTransactions;
    }

    function signTransaction(uint transactionId)
        validOwner
        public {

        Transaction storage transaction = _transactions[transactionId];

        // Transactoin must exists
        require(address(0x0) != transaction.from);
        // Creator cannot sign the transaction
        require(msg.sender != transaction.from);
        // Cannot sing a transaction more than once
        require(transaction.signatures[msg.sender] != 1);
        transaction.signatures[msg.sender] = 1;
        transaction.singatureCount++;

        emit TransactionSigned(msg.sender, transactionId);

        if (transaction.singatureCount >= MIN_SINGNATURE) {
            require(address(this).balance >= transaction.amount);
            transaction.to.transfer(transaction.amount);
            emit TransactionCompleted(transaction.from, transaction.to, transaction.amount, transactionId);
            deleteTransaction(transactionId);
        }
    }

    function deleteTransaction(uint transactionId)
        validOwner
        public {
        uint8 replace = 0;

        for(uint i = 0; i < _pendingTransactions.length; i++) {
            if (replace == 1) {
                _pendingTransactions[i-1] = _pendingTransactions[i];
            }
            else if (transactionId == _pendingTransactions[i]) {
                replace = 1;
            }
        }
        delete _pendingTransactions[_pendingTransactions.length - 1];
        _pendingTransactions.length--;
        delete _transactions[transactionId];
    }

    function walletBallance()
        view
        public
        returns(uint) {
        return address(this).balance;
    }

}