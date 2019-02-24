let DecentralabToken = artifacts.require('./DecentralabToken.sol');


module.exports = function(deployer) {
    deployer.deploy(DecentralabToken, 1000000);
};


