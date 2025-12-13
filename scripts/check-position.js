const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [user] = await ethers.getSigners();
  console.log("Checking positions for:", user.address);
  console.log("Network:", network.name);

  // Load deployed addresses
  const addressesPath = `./deployments/${network.name}.json`;
  if (!fs.existsSync(addressesPath)) {
    throw new Error(`Deployment file not found: ${addressesPath}`);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

  // Connect to contracts
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = LendingPool.attach(addresses.LendingPool);

  if (!addresses.MockUSDC || !addresses.TestPoolId) {
    console.error("\n❌ Test pool not found. Run create-test-pool.js first.");
    process.exit(1);
  }

  // Get position
  const position = await lendingPool.positions(addresses.TestPoolId, user.address);

  console.log("\n=== Your Position ===");
  console.log("Pool ID:", addresses.TestPoolId);
  console.log("Asset:", addresses.MockUSDC);
  console.log("Deposited:", ethers.formatUnits(position.deposited, 18), "tokens");
  console.log("Borrowed:", ethers.formatUnits(position.borrowed, 18), "tokens");
  
  if (position.deposited > 0n) {
    const ltv = (Number(position.borrowed) / Number(position.deposited)) * 100;
    console.log("Current LTV:", ltv.toFixed(2), "%");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
