const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Initializing testnet with account:", deployer.address);

  // Load deployed addresses
  const addressesPath = `./deployments/${network.name}.json`;
  if (!fs.existsSync(addressesPath)) {
    throw new Error(`Deployment file not found: ${addressesPath}`);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

  // Connect to contracts
  const KYCRegistry = await ethers.getContractFactory("KYCRegistry");
  const kycRegistry = await KYCRegistry.attach(addresses.KYCRegistry);

  const CreditScore = await ethers.getContractFactory("CreditScore");
  const creditScore = await CreditScore.attach(addresses.CreditScore);

  console.log("\n=== Setting up test data ===");

  try {
    // Set deployer as KYC provider first
    console.log("\n1. Setting up KYC provider permissions...");
    const providerTx = await kycRegistry.setProvider(deployer.address, true);
    await providerTx.wait();
    console.log("✓ Deployer is now a KYC provider");

    // Set deployer as KYC verified
    console.log("\n2. Setting KYC status...");
    const kycTx = await kycRegistry.setKYC(deployer.address, true);
    await kycTx.wait();
    console.log("✓ Deployer address verified via KYC");
  } catch (error) {
    console.error("Error setting KYC:", error.message);
    throw error;
  }

  try {
    // Set deployer as score updater
    console.log("\n3. Granting score updater permission...");
    const updaterTx = await creditScore.setUpdater(deployer.address, true);
    await updaterTx.wait();
    console.log("✓ Deployer can now update credit scores");
  } catch (error) {
    console.error("Error setting updater:", error.message);
    throw error;
  }

  try {
    // Initialize credit score
    console.log("\n4. Initializing credit score...");
    const scoreTx = await creditScore.updateScore(
      deployer.address,
      500, // base score
      0, // total loans
      0, // total repaid
      true // kyc verified
    );
    await scoreTx.wait();
    console.log("✓ Credit score initialized to 500/1000");
  } catch (error) {
    console.error("Error updating score:", error.message);
    throw error;
  }

  console.log("\n=== Initialization Complete ===");
  console.log("\nYour test account is now:");
  console.log("  ✓ KYC Verified");
  console.log("  ✓ Credit Score: 500/1000");
  console.log("  ✓ Ready to use the platform!");
  console.log("\nNext: Create a test pool with 'npx hardhat run scripts/create-test-pool.js --network", network.name + "'");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
