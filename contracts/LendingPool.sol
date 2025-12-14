// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Lending Pool for decentralized P2P lending
contract LendingPool is Ownable, ReentrancyGuard {
    struct PoolConfig {
        IERC20 asset;            // ERC20 token used for lending/borrowing
        uint256 ltv;             // Loan-to-value ratio in bps (e.g., 7500 = 75%)
        uint256 baseRate;        // Base interest rate in bps per year
        uint256 utilRateSlope1;  // Interest slope before kink
        uint256 utilRateSlope2;  // Interest slope after kink
        uint256 kink;            // Utilization kink in bps
        bool isActive;
    }

    struct UserPosition {
        uint256 deposited;   // Total deposited amount
        uint256 borrowed;    // Total borrowed amount
        uint256 debtIndex;   // Interest index at last update
    }

    IERC20 public immutable platformToken;
    uint256 public constant YEAR_IN_SECONDS = 365 days;

    // poolId => config
    mapping(bytes32 => PoolConfig) public pools;
    // poolId => user => position
    mapping(bytes32 => mapping(address => UserPosition)) public positions;

    event PoolCreated(bytes32 indexed poolId, address asset);
    event Deposited(bytes32 indexed poolId, address indexed user, uint256 amount);
    event Withdrawn(bytes32 indexed poolId, address indexed user, uint256 amount);
    event Borrowed(bytes32 indexed poolId, address indexed user, uint256 amount);
    event Repaid(bytes32 indexed poolId, address indexed user, uint256 amount);

    constructor(IERC20 _platformToken) Ownable(msg.sender) {
        platformToken = _platformToken;
    }

    function getPoolId(IERC20 asset) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(address(asset)));
    }

    function createPool(
        IERC20 asset,
        uint256 ltv,
        uint256 baseRate,
        uint256 utilRateSlope1,
        uint256 utilRateSlope2,
        uint256 kink
    ) external onlyOwner {
        bytes32 poolId = getPoolId(asset);
        require(!pools[poolId].isActive, "Pool exists");
        require(ltv <= 9000, "LTV too high");
        require(kink > 0 && kink < 10000, "Invalid kink");

        pools[poolId] = PoolConfig({
            asset: asset,
            ltv: ltv,
            baseRate: baseRate,
            utilRateSlope1: utilRateSlope1,
            utilRateSlope2: utilRateSlope2,
            kink: kink,
            isActive: true
        });

        emit PoolCreated(poolId, address(asset));
    }

    function deposit(bytes32 poolId, uint256 amount) external nonReentrant {
        PoolConfig memory pool = pools[poolId];
        require(pool.isActive, "Inactive pool");
        require(amount > 0, "Amount=0");

        pool.asset.transferFrom(msg.sender, address(this), amount);
        positions[poolId][msg.sender].deposited += amount;

        emit Deposited(poolId, msg.sender, amount);
    }

    function withdraw(bytes32 poolId, uint256 amount) external nonReentrant {
        PoolConfig memory pool = pools[poolId];
        require(pool.isActive, "Inactive pool");

        UserPosition storage pos = positions[poolId][msg.sender];
        require(amount > 0 && amount <= pos.deposited, "Invalid amount");
        require(pos.borrowed == 0, "Outstanding debt");

        pos.deposited -= amount;
        pool.asset.transfer(msg.sender, amount);

        emit Withdrawn(poolId, msg.sender, amount);
    }

    function borrow(bytes32 poolId, uint256 amount) external nonReentrant {
        PoolConfig memory pool = pools[poolId];
        require(pool.isActive, "Inactive pool");
        require(amount > 0, "Amount=0");

        UserPosition storage pos = positions[poolId][msg.sender];
        uint256 maxBorrow = (pos.deposited * pool.ltv) / 10000;
        require(pos.borrowed + amount <= maxBorrow, "Exceeds LTV");

        pos.borrowed += amount;
        pool.asset.transfer(msg.sender, amount);

        emit Borrowed(poolId, msg.sender, amount);
    }

    function repay(bytes32 poolId, uint256 amount) external nonReentrant {
        PoolConfig memory pool = pools[poolId];
        require(pool.isActive, "Inactive pool");

        UserPosition storage pos = positions[poolId][msg.sender];
        require(amount > 0 && pos.borrowed > 0, "Nothing to repay");

        uint256 repayAmount = amount > pos.borrowed ? pos.borrowed : amount;
        pool.asset.transferFrom(msg.sender, address(this), repayAmount);
        pos.borrowed -= repayAmount;

        emit Repaid(poolId, msg.sender, repayAmount);
    }
}
