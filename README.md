# Hardhat Starter

```shell
# set origin remote
git remote set-url origin <new_url>

# install dependencies
yarn

# compile contract
$ npx hardhat compile

# generate docs
$ npx hardhat docgen

# get storage layout
$ npx hardhat check

# deploy contracts
$ npx hardhat run scripts/deploy.ts --netowrk network_name

# verify contract
$ npx hardhat verify contract_address "arg1" "arg2" --network mainnet


npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
