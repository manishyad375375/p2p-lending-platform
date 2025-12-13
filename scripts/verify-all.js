const fs = require("fs");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

async function main() {
  const networkName = process.argv[2] || "sepolia";
  
  console.log(`Verifying all contracts on ${networkName}...\n`);

  // Load deployed addresses
  const addressesPath = `./deployments/${networkName}.json`;
  if (!fs.existsSync(addressesPath)) {
    throw new Error(`Deployment file not found: ${addressesPath}`);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

  const contracts = [
    { name: "PlatformToken", address: addresses.PlatformToken, args: [] },
    { name: "Governance", address: addresses.Governance, args: [addresses.PlatformToken] },
    { name: "LendingPool", address: addresses.LendingPool, args: [addresses.PlatformToken] },
    { name: "CreditScore", address: addresses.CreditScore, args: [] },
    { name: "KYCRegistry", address: addresses.KYCRegistry, args: [] },
    { name: "FlashLoan", address: addresses.FlashLoan, args: [addresses.PlatformToken] },
  ];

  for (const contract of contracts) {
    console.log(`Verifying ${contract.name} at ${contract.address}...`);
    
    try {
      const argsStr = contract.args.length > 0 ? `--constructor-args ${contract.args.join(' ')}` : '';
      const cmd = `npx hardhat verify --network ${networkName} ${contract.address} ${argsStr}`;
      
      const { stdout, stderr } = await execPromise(cmd);
      
      if (stdout.includes("Successfully verified") || stdout.includes("Already Verified")) {
        console.log(`  ✓ ${contract.name} verified\n`);
      } else {
        console.log(`  ⚠ ${contract.name} verification status unclear`);
        console.log(`  ${stdout}\n`);
      }
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log(`  ✓ ${contract.name} already verified\n`);
      } else {
        console.log(`  ✗ ${contract.name} verification failed`);
        console.log(`  ${error.message}\n`);
      }
    }
  }

  console.log("\n=== Verification Complete ===");
  console.log(`View contracts at: https://${networkName}.etherscan.io/address/${addresses.LendingPool}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
