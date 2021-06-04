var EventsFactory = artifacts.require("EventsFactory");

module.exports = function(deployer) {
    deployer.deploy(EventsFactory);
};