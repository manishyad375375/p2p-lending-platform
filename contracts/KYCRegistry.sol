// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title KYC registry compatible with Civic/SelfKey attestations (simplified)
contract KYCRegistry is Ownable {
    mapping(address => bool) public isKycVerified;
    mapping(address => bool) public kycProviders; // Civic, SelfKey, etc.

    event ProviderSet(address indexed provider, bool allowed);
    event KYCUpdated(address indexed user, bool verified, address indexed provider);

    modifier onlyProvider() {
        require(kycProviders[msg.sender] || msg.sender == owner(), "Not provider");
        _;
    }

    function setProvider(address provider, bool allowed) external onlyOwner {
        kycProviders[provider] = allowed;
        emit ProviderSet(provider, allowed);
    }

    function setKYC(address user, bool verified) external onlyProvider {
        isKycVerified[user] = verified;
        emit KYCUpdated(user, verified, msg.sender);
    }
}
