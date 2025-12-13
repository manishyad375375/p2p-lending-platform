// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Simple on-chain credit scoring based on wallet activity
contract CreditScore is Ownable {
    struct ScoreData {
        uint256 score;          // 0 - 1000
        uint256 lastUpdated;
        uint256 totalLoans;
        uint256 totalRepaid;
        bool kycVerified;
    }

    mapping(address => ScoreData) public scores;
    mapping(address => bool) public scoreUpdaters; // allowed oracles/indexers

    event ScoreUpdated(address indexed user, uint256 score, bool kycVerified);
    event UpdaterSet(address indexed updater, bool allowed);

    modifier onlyUpdater() {
        require(scoreUpdaters[msg.sender] || msg.sender == owner(), "Not updater");
        _;
    }

    function setUpdater(address updater, bool allowed) external onlyOwner {
        scoreUpdaters[updater] = allowed;
        emit UpdaterSet(updater, allowed);
    }

    function updateScore(
        address user,
        uint256 newScore,
        uint256 totalLoans,
        uint256 totalRepaid,
        bool kycVerified
    ) external onlyUpdater {
        require(newScore <= 1000, "Score too high");

        scores[user] = ScoreData({
            score: newScore,
            lastUpdated: block.timestamp,
            totalLoans: totalLoans,
            totalRepaid: totalRepaid,
            kycVerified: kycVerified
        });

        emit ScoreUpdated(user, newScore, kycVerified);
    }

    function getScore(address user) external view returns (ScoreData memory) {
        return scores[user];
    }
}
