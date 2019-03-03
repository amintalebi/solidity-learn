
let DecentralabToken = artifacts.require('./DecentralabToken.sol');

contract('DecentralabToken', function(accounts) {

    let tokenInstance;


    it('initializes the contract with the correct values', function() {
        return DecentralabToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, 'Decentralab Token', 'token name is not corret');
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, 'Decetralab', 'symbol is not correct');
        });
    })

    it('sets the total supply upon deployment', function() {
        return DecentralabToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the intial supply to the admin account');
        })
    })

    it('should transfer token ownership', function() {
        return DecentralabToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 999999999);
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]});
        }).then(function(success) {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggres one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transfered from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
        })
    })

    it("approves tokens for delagated trasnfer", function() {
        return DecentralabToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success){
            assert.equal(success, true, 'it returns true');
            return tokenInstance.approve(accounts[1], 100, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggres one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the authorized amount');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer')
        });
    });

    it('handles delegated token transfer', function (instance) {
        return DecentralabToken.deployed().then(function(instance) {
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            return tokenInstance.transfer(fromAccount, 100, { from: accounts[0]} );
        }).then(function(receipt){
            return tokenInstance.approve(spendingAccount, 10, { from: fromAccount} );
        }).then(function(receipt){
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from : spendingAccount });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
            return tokenInstance.transferFrom(fromAccount, toAccount, 5, { from : spendingAccount });
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggres one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are authorized by');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, 5, 'logs the authorized amount');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 95, 'decucts the balance');
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 5, 'increases the balance');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 5, 'decucts the allowance');
            
            //tokenInstance.balanceOf(fromAccount, (err, res) => console.log(res));
            //tokenInstance.balanceOf(toAccount, (err, res) => console.log(res));
            //tokenInstance.allowance(fromAccount, spendingAccount, (err, res) => console.log(res));
            throw new Error("test ended successfully!")
        });
    });
});
