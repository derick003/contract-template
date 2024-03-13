// SPDX-License-Identifier: MIT
pragma solidity =0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract BatchTransfer is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    constructor(address initialOwner_) Ownable(initialOwner_) {}

    function batchTransferEth(address payable[] calldata receivers, uint256 amount) external payable nonReentrant {
        uint256 length = receivers.length;
        if (length <= 0 || amount <= 0) {
            revert InvalidParameters();
        }
        uint256 totalAmount = amount * length;
        if (msg.value < totalAmount) {
            revert InsufficientBalance();
        }
        for (uint256 i = 0; i < length; ++i) {
            (bool success, ) = receivers[i].call{value: amount}("");
            if (!success) {
                revert FailedInnerCall();
            }
        }
    }

    function batchTransferErc20(IERC20 token, address[] calldata receivers, uint256 amount) external nonReentrant {
        uint256 length = receivers.length;
        if (length <= 0 || amount <= 0) {
            revert InvalidParameters();
        }
        uint256 totalAmount = amount * length;
        if (token.balanceOf(msg.sender) < totalAmount) {
            revert InsufficientBalance();
        }
        for (uint256 i = 0; i < length; ++i) {
            token.safeTransferFrom(msg.sender, receivers[i], amount);
        }
    }

    function batchTransferErc721(IERC721 token, address[] calldata receivers, uint256[] calldata amounts) external nonReentrant {
        uint256 length = receivers.length;
        if (length <= 0 || length != amounts.length) {
            revert InvalidParameters();
        }
        for (uint256 i = 0; i < length; ++i) {
            token.safeTransferFrom(msg.sender, receivers[i], amounts[i]);
        }
    }

    function withdraw(address tokenAddress, uint256 amount) external onlyOwner {
        if (tokenAddress == address(0)) {
            (bool success, ) = address(msg.sender).call{value: amount}("");
            if (!success) {
                revert FailedInnerCall();
            }
        } else {
            IERC20(tokenAddress).safeTransfer(msg.sender, amount);
        }
    }

    error InvalidParameters();
    error InsufficientBalance();
    error FailedInnerCall();

    receive() external payable {}

}