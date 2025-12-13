const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Backend signer address (update this with your actual backend wallet)
  const BACKEND_SIGNER = process.env.BACKEND_SIGNER_ADDRESS || deployer.address;
  
  console.log("Granting permissions...");
  console.log("Admin:", deployer.address);
  console.log("Backend Signer:", BACKEND_SIGNER);

  // Load deployed addresses
  const addressesPath = `./deployments/${network.name}.json`;
  if (!fs.existsSync(addressesPath)) {
    throw new Error(`Deployment file not found: ${addressesPath}`);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

  // Connect to contracts
  const KYCRegistry = await ethers.getContractFactory("KYCRegistry");
  const kycRegistry = KYCRegistry.attach(addresses.KYCRegistry);

  const CreditScore = await ethers.getContractFactory("CreditScore");
  const creditScore = CreditScore.attach(addresses.CreditScore);

  console.log("\n1. Setting KYC provider permissions...");
  const kycTx = await kycRegistry.setProvider(BACKEND_SIGNER, true);
  await kycTx.wait();
  console.log("✓ Backend signer can now update KYC status");

  console.log("\n2. Setting score updater permissions...");
  const scoreTx = await creditScore.setUpdater(BACKEND_SIGNER, true);
  await scoreTx.wait();
  console.log("✓ Backend signer can now update credit scores");

  console.log("\n=== Permissions Granted ===");
  console.log(`Backend signer ${BACKEND_SIGNER} can now:");
  console.log("  ✓ Update KYC status");
  console.log("  ✓ Update credit scores");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
