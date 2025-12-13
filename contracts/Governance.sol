// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PlatformToken.sol";

/// @title Simple governance via token-weighted voting
contract Governance is Ownable {
    struct Proposal {
        address proposer;
        string description;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
    }

    PlatformToken public immutable token;
    uint256 public proposalCount;
    uint256 public votingDelay = 1; // blocks
    uint256 public votingPeriod = 45818; // ~1 week on Ethereum

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed id, address proposer, string description);
    event Voted(uint256 indexed id, address voter, bool support, uint256 weight);
    event Executed(uint256 indexed id);

    constructor(PlatformToken _token) {
        token = _token;
    }

    function propose(string calldata description) external returns (uint256) {
        require(token.balanceOf(msg.sender) > 0, "No voting power");

        proposalCount++;
        uint256 id = proposalCount;

        proposals[id] = Proposal({
            proposer: msg.sender,
            description: description,
            startBlock: block.number + votingDelay,
            endBlock: block.number + votingDelay + votingPeriod,
            forVotes: 0,
            againstVotes: 0,
            executed: false
        });

        emit ProposalCreated(id, msg.sender, description);
        return id;
    }

    function vote(uint256 id, bool support) external {
        Proposal storage prop = proposals[id];
        require(block.number >= prop.startBlock, "Voting not started");
        require(block.number <= prop.endBlock, "Voting ended");
        require(!hasVoted[id][msg.sender], "Already voted");

        uint256 weight = token.balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        hasVoted[id][msg.sender] = true;
        if (support) {
            prop.forVotes += weight;
        } else {
            prop.againstVotes += weight;
        }

        emit Voted(id, msg.sender, support, weight);
    }

    function execute(uint256 id) external onlyOwner {
        Proposal storage prop = proposals[id];
        require(block.number > prop.endBlock, "Voting not ended");
        require(!prop.executed, "Executed");
        require(prop.forVotes > prop.againstVotes, "Not passed");

        prop.executed = true;
        emit Executed(id);
    }
}
