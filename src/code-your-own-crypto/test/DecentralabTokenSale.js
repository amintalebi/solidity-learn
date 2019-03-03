let DecentralabTokenSale = artifacts.require('./DecentralabTokenSale.sol');
                                                

contract('DecentralabTokenSale', function (accounts){
    let tokenSaleInstance;

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

});


