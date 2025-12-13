const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Minting tokens to:", deployer.address);

  // Load deployed addresses
  const addressesPath = `./deployments/${network.name}.json`;
  if (!fs.existsSync(addressesPath)) {
    throw new Error(`Deployment file not found: ${addressesPath}`);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

  if (!addresses.MockUSDC) {
    console.error("❌ MockUSDC not found. Run create-test-pool.js first.");
    process.exit(1);
  }

  // Connect to MockUSDC
  const MockERC20 = await ethers.getContractFactory("PlatformToken");
  const mockUSDC = MockERC20.attach(addresses.MockUSDC);

  // Mint 10,000 USDC
  const amount = ethers.parseUnits("10000", 18);
  console.log("\nMinting 10,000 Mock USDC...");
  
  const tx = await mockUSDC.mint(deployer.address, amount);
  await tx.wait();

  const balance = await mockUSDC.balanceOf(deployer.address);
  console.log("✓ Minted successfully!");
  console.log("New balance:", ethers.formatUnits(balance, 18), "USDC");
  console.log("\nYou can now deposit this USDC in the frontend!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
