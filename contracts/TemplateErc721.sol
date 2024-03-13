// SPDX-License-Identifier: MIT
pragma solidity =0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721, ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TemplateErc721 is Ownable, ERC721Enumerable {

    uint256 internal _nextTokenId = 1;
    constructor(string memory name_, string memory symbol_, address owner_) Ownable(owner_) ERC721(name_, symbol_) {
        _mint(msg.sender, _nextTokenId);
        ++_nextTokenId;
    }

    function mint(address account, uint256 amount) external onlyOwner {
        for (uint256 i = 0; i < amount; ++i) {
            _mint(account, _nextTokenId);
            ++_nextTokenId;
        }
    }
}