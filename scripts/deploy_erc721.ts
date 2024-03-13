import { ethers, run } from "hardhat";
import { readJson, deployContract } from "./utils";

async function main() {

  const [deployer] = await ethers.getSigners();

  const erc721Args = {
    name: "BoredApeYachtClub",
    symbol: "BAYC",
    initialOwner: "0x5EfAC4Bc165338F511F2eb4411E393AF25D37b23",
  }
  await deployContract("TemplateErc721", "templateErc721", deployer, erc721Args, [[erc721Args.name, erc721Args.symbol, erc721Args.initialOwner]])
  
  const path = "config/contracts.json";
  const contracts = readJson(path)

  await run("verify:verify", {
    address: contracts.templateErc721.address,
    constructorArguments: [
      erc721Args.name,
      erc721Args.symbol,
      erc721Args.initialOwner
    ]
  })

  console.log("finished");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
