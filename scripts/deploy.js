const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("\n=== P2P Lending Platform Deployment ===");
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Network:", network.name);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  const deployedAddresses = {};

  // Deploy PlatformToken
  console.log("1. Deploying PlatformToken...");
  const PlatformToken = await ethers.getContractFactory("PlatformToken");
  const token = await PlatformToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("   ✓ PlatformToken deployed:", tokenAddress);
  deployedAddresses.PlatformToken = tokenAddress;

  // Deploy Governance
  console.log("\n2. Deploying Governance...");
  const Governance = await ethers.getContractFactory("Governance");
  const governance = await Governance.deploy(tokenAddress);
  await governance.waitForDeployment();
  const governanceAddress = await governance.getAddress();
  console.log("   ✓ Governance deployed:", governanceAddress);
  deployedAddresses.Governance = governanceAddress;

  // Deploy LendingPool
  console.log("\n3. Deploying LendingPool...");
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(tokenAddress);
  await lendingPool.waitForDeployment();
  const lendingPoolAddress = await lendingPool.getAddress();
  console.log("   ✓ LendingPool deployed:", lendingPoolAddress);
  deployedAddresses.LendingPool = lendingPoolAddress;

  // Deploy CreditScore
  console.log("\n4. Deploying CreditScore...");
  const CreditScore = await ethers.getContractFactory("CreditScore");
  const creditScore = await CreditScore.deploy();
  await creditScore.waitForDeployment();
  const creditScoreAddress = await creditScore.getAddress();
  console.log("   ✓ CreditScore deployed:", creditScoreAddress);
  deployedAddresses.CreditScore = creditScoreAddress;

  // Deploy KYCRegistry
  console.log("\n5. Deploying KYCRegistry...");
  const KYCRegistry = await ethers.getContractFactory("KYCRegistry");
  const kycRegistry = await KYCRegistry.deploy();
  await kycRegistry.waitForDeployment();
  const kycRegistryAddress = await kycRegistry.getAddress();
  console.log("   ✓ KYCRegistry deployed:", kycRegistryAddress);
  deployedAddresses.KYCRegistry = kycRegistryAddress;

  // Deploy FlashLoan (optional - using PlatformToken as asset)
  console.log("\n6. Deploying FlashLoan...");
  const FlashLoan = await ethers.getContractFactory("FlashLoan");
  const flashLoan = await FlashLoan.deploy(tokenAddress);
  await flashLoan.waitForDeployment();
  const flashLoanAddress = await flashLoan.getAddress();
  console.log("   ✓ FlashLoan deployed:", flashLoanAddress);
  deployedAddresses.FlashLoan = flashLoanAddress;

  // Save deployment addresses
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentPath = path.join(deploymentsDir, `${network.name}.json`);
  fs.writeFileSync(
    deploymentPath,
    JSON.stringify({
      ...deployedAddresses,
      network: network.name,
      chainId: network.config.chainId,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
    }, null, 2)
  );

  console.log("\n=== Deployment Summary ===");
  console.log("Network:", network.name);
  console.log("Chain ID:", network.config.chainId);
  console.log("\nContract Addresses:");
  Object.entries(deployedAddresses).forEach(([name, address]) => {
    console.log(`  ${name}: ${address}`);
  });
  console.log("\nDeployment data saved to:", deploymentPath);

  console.log("\n=== Next Steps ===");
  console.log("1. Verify contracts:");
  console.log(`   npx hardhat verify --network ${network.name} ${tokenAddress}`);
  console.log("\n2. Initialize testnet:");
  console.log(`   npx hardhat run scripts/initialize-testnet.js --network ${network.name}`);
  console.log("\n3. Create test pool:");
  console.log(`   npx hardhat run scripts/create-test-pool.js --network ${network.name}`);
  console.log("\n4. Update frontend .env with contract addresses");
  console.log("\n5. Update backend .env with contract addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
