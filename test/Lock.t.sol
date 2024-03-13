// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "forge-std/console.sol";

import "../contracts/Lock.sol";

contract LockTest is Test {

    Lock public lock;
    address account = 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045;

    function setUp() public {

        vm.startBroadcast(account);
        lock = new Lock();
        vm.stopBroadcast();
    }

    function testWithdraw() public {
        vm.startBroadcast(account);
        vm.warp(block.timestamp + 2);
        lock.withdraw();
        vm.stopBroadcast();
    }
}