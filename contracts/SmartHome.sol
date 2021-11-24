//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SmartHome {
    address public gateway;
    uint public thermostatTemperature;
    bytes public garageCamera;
    bool public bedroomLight;

    constructor(uint tt, bytes memory gc, bool bl) {
        console.log("Deploying a SmartHome Contract");
        gateway = msg.sender;
        thermostatTemperature = tt;
        garageCamera = gc;
        bedroomLight = bl;
    }

    function setThermostatTemperature(uint tt) public {
        require(msg.sender == gateway);
        console.log("Changing Thermostat Temperature from '%s' to '%s'", thermostatTemperature, tt);
        thermostatTemperature = tt;
    }

    function setGarageCamera(bytes memory gc) public {
        require(msg.sender == gateway);
        console.log("Changing Garage Camera");
        garageCamera = gc;
    }

    function setBedroomLight(bool bl) public {
        require(msg.sender == gateway);
        console.log("Changing Bedroom Light from '%s' to '%s'", bedroomLight, bl);
        bedroomLight = bl;
    }
}
