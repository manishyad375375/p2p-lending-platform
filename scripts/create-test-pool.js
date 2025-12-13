const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Creating test pool with account:", deployer.address);

  // Load deployed addresses
  const addressesPath = `./deployments/${network.name}.json`;
  if (!fs.existsSync(addressesPath)) {
    throw new Error(`Deployment file not found: ${addressesPath}`);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

  // Connect to LendingPool
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = LendingPool.attach(addresses.LendingPool);

  // Deploy mock USDC for testing
  console.log("\nDeploying mock USDC...");
  const MockERC20 = await ethers.getContractFactory("PlatformToken");
  const mockUSDC = await MockERC20.deploy();
  await mockUSDC.deployed();
  console.log("Mock USDC deployed to:", mockUSDC.address);

  // Mint some USDC to deployer
  await mockUSDC.mint(deployer.address, ethers.parseUnits("10000", 18));
  console.log("Minted 10,000 mock USDC to deployer");

  // Create lending pool for USDC
  console.log("\nCreating lending pool...");
  const tx = await lendingPool.createPool(
    mockUSDC.address,
    7500, // 75% LTV
    200, // 2% base rate
    500, // utilization slope 1
    2000, // utilization slope 2
    8000 // kink at 80%
  );
  await tx.wait();

  const poolId = await lendingPool.getPoolId(mockUSDC.address);
  console.log("Pool created with ID:", poolId);

  // Save mock token address
  addresses.MockUSDC = mockUSDC.address;
  addresses.TestPoolId = poolId;
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

  console.log("\n=== Test Pool Configuration ===");
  console.log("Mock USDC Address:", mockUSDC.address);
  console.log("Pool ID:", poolId);
  console.log("LTV: 75%");
  console.log("Base Rate: 2%");
  console.log("\nYou can now deposit and borrow from this pool!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
