import fs from "fs";
import { ethers } from "hardhat";

const contractPath = "config/contracts.json";

function writeFileSync(path: string, content: string) {
    fs.writeFileSync(path, content);
}

function readFileSync(path: string) {
    return fs.readFileSync(path, "utf-8");
}

function writeJson(path: string, content: object) {
    const jsonContent = JSON.stringify(content, null, "\t");
    writeFileSync(path, jsonContent);
}

function readJson(path: string) {
    const rawdata = readFileSync(path);
    const json = JSON.parse(rawdata);
    return json;
}

const legacyChainIds = [97];

async function getFeeData() {
    let feeData = await ethers.provider.getFeeData();
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? BigInt("1000000000");
    const gasPrice = feeData.gasPrice ?? BigInt("1000000000");
    const maxFeePerGas = gasPrice * 160n / 100n + maxPriorityFeePerGas;
    return new ethers.FeeData(feeData.gasPrice, maxFeePerGas, maxPriorityFeePerGas);
}

async function deployContract(contractName: string, alias: string, deployer: any, contractArgs: any, args: any[] = []) {
    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
    const feeData = await getFeeData();
    let costLimit;
    if (legacyChainIds.includes(Number(chainId))) {
        costLimit = {
            signer: deployer,
            gasPrice: feeData.gasPrice,
            gasLimit: 3000000,
        };
    } else {
        costLimit = {
            signer: deployer,
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
            gasLimit: 3000000,
        };
    }
    args.push(costLimit);
    console.log(`---------deploy ${contractName}`);
    const contract = await ethers.deployContract(contractName, ...args);
    await contract.waitForDeployment();
    console.log(`---------deployed ${contractName}:`, contract.target);
    const contractJson = readJson(contractPath)

    const json: any = {};
    json[alias] = {
        address: contract.target
    }
    if (contractArgs != null) {
        json[alias]["args"] = contractArgs;
    }

    Object.assign(contractJson, json);
    writeJson(contractPath, contractJson)
    return contract.target
}

async function executeTx(
    contractName: string,
    contractAddress: string,
    methodName: string,
    value: string,
    deployer: any,
    args: any[] = []
) {
    const contract = await ethers.getContractAt(contractName, contractAddress, deployer);
    const estimatedGas = await contract[methodName].estimateGas(...args);

    const feeData = await getFeeData();
    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
    let costLimit;
    if (legacyChainIds.includes(Number(chainId))) {
        costLimit = {
            gasPrice: feeData.gasPrice,
            value: ethers.parseEther(value),
            gasLimit: estimatedGas,
        };
    } else {
        costLimit = {
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
            value: ethers.parseEther(value),
            gasLimit: estimatedGas,
        };
    }
    args.push(costLimit);


    console.log(`---------execute ${methodName}`);
    const tx = await contract[methodName](...args);
    await tx.wait();
    console.log(`---------execute ${methodName}:`, tx.hash);
}

export { writeFileSync, readFileSync, writeJson, readJson, deployContract, executeTx };
