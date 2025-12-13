const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("\n=== Checking Deployment ===");
  console.log("Network:", network.name);

  // Load deployed addresses
  const addressesPath = `./deployments/${network.name}.json`;
  if (!fs.existsSync(addressesPath)) {
    console.error("❌ Deployment file not found:", addressesPath);
    process.exit(1);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
  
  console.log("\n=== Deployed Contracts ===");
  
  for (const [name, address] of Object.entries(addresses)) {
    if (name === 'network' || name === 'chainId' || name === 'deployer' || name === 'timestamp') {
      continue;
    }
    
    try {
      const code = await ethers.provider.getCode(address);
      const isDeployed = code !== '0x';
      
      if (isDeployed) {
        console.log(`✓ ${name}: ${address}`);
      } else {
        console.log(`❌ ${name}: ${address} (no code found)`);
      }
    } catch (error) {
      console.log(`⚠️  ${name}: ${address} (error checking)`);
    }
  }

  console.log("\n=== Network Info ===");
  console.log("Chain ID:", addresses.chainId || 'unknown');
  console.log("Deployer:", addresses.deployer || 'unknown');
  console.log("Deployed:", addresses.timestamp || 'unknown');

  // Try to connect to each contract
  console.log("\n=== Testing Contract Connections ===");

  if (addresses.KYCRegistry) {
    try {
      const kyc = await ethers.getContractAt("KYCRegistry", addresses.KYCRegistry);
      const owner = await kyc.owner();
      console.log("✓ KYCRegistry connected, owner:", owner);
    } catch (error) {
      console.log("❌ KYCRegistry error:", error.message);
    }
  }

  if (addresses.CreditScore) {
    try {
      const score = await ethers.getContractAt("CreditScore", addresses.CreditScore);
      const owner = await score.owner();
      console.log("✓ CreditScore connected, owner:", owner);
    } catch (error) {
      console.log("❌ CreditScore error:", error.message);
    }
  }

  if (addresses.LendingPool) {
    try {
      const pool = await ethers.getContractAt("LendingPool", addresses.LendingPool);
      const owner = await pool.owner();
      console.log("✓ LendingPool connected, owner:", owner);
    } catch (error) {
      console.log("❌ LendingPool error:", error.message);
    }
  }

  if (addresses.PlatformToken) {
    try {
      const token = await ethers.getContractAt("PlatformToken", addresses.PlatformToken);
      const name = await token.name();
      const symbol = await token.symbol();
      console.log(`✓ PlatformToken connected: ${name} (${symbol})`);
    } catch (error) {
      console.log("❌ PlatformToken error:", error.message);
    }
  }

  console.log("\n✓ Deployment check complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
