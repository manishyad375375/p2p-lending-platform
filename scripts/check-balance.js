const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Checking balances for:", deployer.address);
  console.log("Network:", network.name);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInEth = ethers.formatEther(balance);
  
  console.log("\nBalance:", balanceInEth, network.name === "mumbai" ? "MATIC" : "ETH");
  
  if (parseFloat(balanceInEth) < 0.05) {
    console.log("\n⚠️  Low balance! You may need more testnet tokens.");
    console.log("\nGet testnet tokens from:");
    if (network.name === "sepolia") {
      console.log("  - https://sepoliafaucet.com/");
      console.log("  - https://www.alchemy.com/faucets/ethereum-sepolia");
    } else if (network.name === "mumbai") {
      console.log("  - https://faucet.polygon.technology/");
      console.log("  - https://mumbaifaucet.com/");
    }
  } else {
    console.log("\n✓ Balance looks good for deployment!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
