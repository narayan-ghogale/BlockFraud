var tender = artifacts.require("./tender.sol");

module.exports = function(deployer) {
  deployer.deploy(tender);
};
