let DecentralabToken = artifacts.require('./DecentralabToken.sol');
let DecentralabTokenSale = artifacts.require('./DecentralabTokenSale.sol');

module.exports = function(deployer) {
    deployer.deploy(DecentralabToken, 1000000).then(function() {
        return deployer.deploy(DecentralabTokenSale, DecentralabToken.address);
    });
    
};


