import { ethers, run } from "hardhat";
import { readJson, deployContract } from "./utils";

async function main() {

  const [deployer] = await ethers.getSigners();

  const erc20Args = {
    name: "Tether USD",
    symbol: "USDT",
    initialOwner: deployer.address,
  }
  await deployContract("TemplateErc20", "templateErc20", deployer, erc20Args, [[erc20Args.name, erc20Args.symbol, erc20Args.initialOwner]])
  
  const path = "config/contracts.json";
  const contracts = readJson(path)

  await run("verify:verify", {
    address: contracts.templateErc20.address,
    constructorArguments: [
      erc20Args.name,
      erc20Args.symbol,
      erc20Args.initialOwner
    ]
  })

  console.log("finished");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
