// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "../src/plonk_vk.sol";

contract TurboVerifierTest is Test {
    TurboVerifier verifier;

    function setUp() public {
        verifier = new TurboVerifier();
    }
}
