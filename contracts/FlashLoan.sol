// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Simple flash loan provider for a single asset
contract FlashLoan is ReentrancyGuard {
    IERC20 public immutable asset;
    uint256 public feeBps = 9; // 0.09%

    event FlashLoanExecuted(address indexed borrower, uint256 amount, uint256 fee);

    constructor(IERC20 _asset) {
        asset = _asset;
    }

    function setFee(uint256 _feeBps) external {
        // in production, restrict via Ownable or governance
        require(_feeBps <= 100, "Fee too high");
        feeBps = _feeBps;
    }

    function flashLoan(uint256 amount, bytes calldata data) external nonReentrant {
        uint256 balanceBefore = asset.balanceOf(address(this));
        require(amount > 0 && amount <= balanceBefore, "Invalid amount");

        uint256 fee = (amount * feeBps) / 10000;
        uint256 repayment = amount + fee;

        // transfer funds to borrower
        asset.transfer(msg.sender, amount);

        // borrower must implement receiver logic via low-level call
        (bool ok, ) = msg.sender.call(data);
        require(ok, "Callback failed");

        // check repayment
        uint256 balanceAfter = asset.balanceOf(address(this));
        require(balanceAfter >= balanceBefore + fee, "Not repaid");

        emit FlashLoanExecuted(msg.sender, amount, fee);
    }
}
