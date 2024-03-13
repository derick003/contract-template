// SPDX-License-Identifier: MIT
pragma solidity =0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TemplateErc20 is Ownable, ERC20 {

    constructor(string memory name_, string memory symbol_, address owner_) Ownable(owner_) ERC20(name_, symbol_) {
        _mint(msg.sender, 10000000e18);
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}