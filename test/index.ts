import chai, { expect } from "chai";
import { randomBytes } from "crypto";
import { ethers } from "hardhat";
import chaiBytes from "chai-bytes";
import { SmartHome } from "../src/smart-home";

chai.use(chaiBytes);

let smartHome: SmartHome;

before(async () => {
    const Contract = await ethers.getContractFactory("SmartHome");
    const contract = await Contract.deploy(10, [], false);
    await contract.deployed();
    smartHome = new SmartHome(contract.address, contract.signer);
});

describe("SmartHome", function () {
    it("Should return the new thermostatTemperature once it's changed", async function () {

        expect(await smartHome.thermostatTemperature()).to.equal(10);

        const setTemperatureTx = await smartHome.setThermostatTemperature(20);

        // wait until the transaction is mined
        await setTemperatureTx.wait();

        expect(await smartHome.thermostatTemperature()).to.equal(20);
    });

    it("Should return the new garageCamera once it's changed", async function () {
        expect(await smartHome.garageCamera()).to.equalBytes(new Uint8Array());

        const bytes = randomBytes(10);

        const setTemperatureTx = await smartHome.setGarageCamera(bytes);

        // wait until the transaction is mined
        await setTemperatureTx.wait();

        expect(await smartHome.garageCamera()).to.equalBytes(bytes);
    });

    it("Should return the new bedroomLight once it's changed", async function () {
        expect(await smartHome.bedroomLight()).to.equal(false);

        const setTemperatureTx = await smartHome.setBedroomLight(true);

        // wait until the transaction is mined
        await setTemperatureTx.wait();

        expect(await smartHome.bedroomLight()).to.equal(true);
    });
});
