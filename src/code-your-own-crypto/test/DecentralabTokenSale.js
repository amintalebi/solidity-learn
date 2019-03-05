let DecentralabTokenSale = artifacts.require('./DecentralabTokenSale.sol');
let DecentralabToken = artifacts.require('./DecentralabToken.sol');

contract('DecentralabTokenSale', function (accounts) {
    let tokenSaleInstance;
    let tokenInstance;
    let tokenPrice = 100000000000000; // 0.0001 ether
    let tokensAvaiable = 750000;
    let numberOfTokens;
    let admin = accounts[0];
    let buyer = accounts[1];
    

    it('initialize the contract with the correct values', function(){
        return DecentralabTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has token contract address');
        })
    });

    it('faciliates token buying', function(){
        return DecentralabToken.deployed().then(function(instance){
            tokenInstance =  instance;
            return DecentralabTokenSale.deployed();
        }).then(function (instance) {   
            tokenSaleInstance = instance;
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvaiable, {from: admin});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggres one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, admin, 'logs the account that sent tokens');
            assert.equal(receipt.logs[0].args._to, tokenSaleInstance.address, 'logs the account that got tokens');
            assert.equal(receipt.logs[0].args._value, tokensAvaiable, 'logs the number of tokens sent');
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function (amount) {
            assert.equal(amount.toNumber(), tokensAvaiable, 'tokenSale contract balance');
            numberOfTokens = 10;
            return tokenSaleInstance.buyToken(10, {from: buyer, value: numberOfTokens * tokenPrice});
         }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggres one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that puchased the tokens');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
            return tokenSaleInstance.tokensSold();
        }).then(function(amount) {
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
            return tokenSaleInstance.buyToken(numberOfTokens, {from: buyer, value: 1});
        })
        .then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'msg.value must be equal number of tokens in wei');
            return tokenSaleInstance.buyToken(750001, {from: buyer, value: 750001 * tokenPrice});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'number of tokens to buy is more than avaiable ones');
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), numberOfTokens, 'increase the number of tokens buyer have')
        })
    });

    it('should end token sale', function () {
        return DecentralabToken.deployed().then(function(instance){
            tokenInstance =  instance;
            return DecentralabTokenSale.deployed();
        }).then(function (instance) {   
            tokenSaleInstance = instance;
            return tokenSaleInstance.endSale({from : buyer});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'just admin can stop token sale')
            return tokenSaleInstance.endSale({from : admin})
        }).then(function(receipt){
            return tokenInstance.balanceOf(admin)
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 999990, 'remaining tokens returns to admin');
            return tokenSaleInstance.tokenPrice();
        }).then(assert.fail).catch(function(error) {
            assert(error.message === "Returned values aren't valid, did it run Out of Gas?", 'contract destroy');
        })

    });

});
