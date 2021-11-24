import { Contract, ContractTransaction, Signer, Transaction } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";

const abi = [
    "function gateway() public view returns (address)",
    "function thermostatTemperature() public view returns (uint)",
    "function garageCamera() public view returns (bytes)",
    "function bedroomLight() public view returns (bool)",
    "function setThermostatTemperature(uint tt) public",
    "function setGarageCamera(bytes memory gc) public",
    "function setBedroomLight(bool bl) public",
];

export class SmartHome {
    private contract: Contract;

    constructor(address: string, provider?: Signer | Provider) {
        this.contract = new Contract(address, abi, provider);
    }

    gateway(): Promise<string> {
        return this.contract.gateway();
    }

    thermostatTemperature(): Promise<number> {
        return this.contract.thermostatTemperature();
    }

    async garageCamera(): Promise<Uint8Array> {
        const hex = await this.contract.garageCamera() as string;
        return Buffer.from(hex.substring(2), "hex");
    }

    bedroomLight(): Promise<boolean> {
        return this.contract.bedroomLight();
    }

    setThermostatTemperature(tt: number): Promise<ContractTransaction> {
        return this.contract.setThermostatTemperature(tt);
    }

    setGarageCamera(gc: Uint8Array): Promise<ContractTransaction> {
        return this.contract.setGarageCamera(gc);
    }

    setBedroomLight(bl: boolean): Promise<ContractTransaction> {
        return this.contract.setBedroomLight(bl);
    }

    connect(signer: Signer): SmartHome {
        return this.contract.connect(signer) as unknown as SmartHome;
    }
}