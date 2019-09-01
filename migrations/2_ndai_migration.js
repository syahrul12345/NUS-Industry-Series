const NDAI = artifacts.require("NDAI");

module.exports = function(deployer) {
  deployer.deploy(NDAI);
};
