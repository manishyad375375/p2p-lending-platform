const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nInitializing account:", deployer.address);
  console.log("Network:", network.name);

  // Load deployed addresses
  const addressesPath = `./deployments/${network.name}.json`;
  if (!fs.existsSync(addressesPath)) {
    throw new Error(`Deployment file not found: ${addressesPath}`);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
  console.log("\nContract Addresses:");
  console.log("KYCRegistry:", addresses.KYCRegistry);
  console.log("CreditScore:", addresses.CreditScore);

  // Get contract ABIs
  const kycArtifact = await ethers.getContractAt("KYCRegistry", addresses.KYCRegistry);
  const scoreArtifact = await ethers.getContractAt("CreditScore", addresses.CreditScore);

  console.log("\n=== Step 1: Setting KYC Provider ===");
  try {
    const tx1 = await kycArtifact.setProvider(deployer.address, true);
    console.log("Transaction sent:", tx1.hash);
    await tx1.wait();
    console.log("✓ You are now a KYC provider");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\nTrying alternative method...");
  }

  console.log("\n=== Step 2: Setting KYC Status ===");
  try {
    // Since you're the owner, you can set KYC directly
    const tx2 = await kycArtifact.setKYC(deployer.address, true);
    console.log("Transaction sent:", tx2.hash);
    await tx2.wait();
    console.log("✓ KYC status set to verified");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  console.log("\n=== Step 3: Setting Score Updater ===");
  try {
    const tx3 = await scoreArtifact.setUpdater(deployer.address, true);
    console.log("Transaction sent:", tx3.hash);
    await tx3.wait();
    console.log("✓ You can now update credit scores");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  console.log("\n=== Step 4: Initializing Credit Score ===");
  try {
    const tx4 = await scoreArtifact.updateScore(
      deployer.address,
      500, // score
      0,   // total loans
      0,   // total repaid
      true // kyc verified
    );
    console.log("Transaction sent:", tx4.hash);
    await tx4.wait();
    console.log("✓ Credit score set to 500/1000");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  console.log("\n=== Verification ===");
  
  // Check KYC status
  const isVerified = await kycArtifact.isKycVerified(deployer.address);
  console.log("KYC Verified:", isVerified ? "✓ Yes" : "❌ No");

  // Check credit score
  const scoreData = await scoreArtifact.getScore(deployer.address);
  console.log("Credit Score:", scoreData.score.toString(), "/ 1000");

  console.log("\n=== Done! ===");
  if (isVerified && scoreData.score > 0) {
    console.log("✓ Initialization successful!");
    console.log("\nNext step: Create a test pool");
    console.log(`npx hardhat run scripts/create-test-pool.js --network ${network.name}`);
  } else {
    console.log("⚠️  Some initialization steps may have failed. Check errors above.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
