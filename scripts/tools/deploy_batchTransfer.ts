import { ethers, run } from "hardhat";
import { readJson, deployContract } from "../utils";

async function main() {

    const [deployer] = await ethers.getSigners();

    const batchTransferArgs = {
        initialOwner: deployer.address
    }
    await deployContract("BatchTransfer", "batchTransfer", deployer, batchTransferArgs, [[batchTransferArgs.initialOwner]])

    const path = "config/contracts.json";
    const contracts = readJson(path)

    await run("verify:verify", {
        address: contracts.batchTransfer.address,
        constructorArguments: [
            batchTransferArgs.initialOwner
        ]
    })

    console.log("finished");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
