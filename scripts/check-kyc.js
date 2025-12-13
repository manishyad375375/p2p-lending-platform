const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [user] = await ethers.getSigners();
  console.log("Checking KYC status for:", user.address);

  // Load deployed addresses
  const addressesPath = `./deployments/${network.name}.json`;
  if (!fs.existsSync(addressesPath)) {
    throw new Error(`Deployment file not found: ${addressesPath}`);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

  // Connect to KYCRegistry
  const KYCRegistry = await ethers.getContractFactory("KYCRegistry");
  const kycRegistry = KYCRegistry.attach(addresses.KYCRegistry);

  // Check KYC status
  const isVerified = await kycRegistry.isKycVerified(user.address);

  console.log("\n=== KYC Status ===");
  console.log("Address:", user.address);
  console.log("Status:", isVerified ? "✓ Verified" : "✗ Not Verified");

  if (!isVerified) {
    console.log("\nTo verify your address, run:");
    console.log(`npx hardhat run scripts/initialize-testnet.js --network ${network.name}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
