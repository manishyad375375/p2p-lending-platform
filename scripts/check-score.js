const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [user] = await ethers.getSigners();
  console.log("Checking credit score for:", user.address);

  // Load deployed addresses
  const addressesPath = `./deployments/${network.name}.json`;
  if (!fs.existsSync(addressesPath)) {
    throw new Error(`Deployment file not found: ${addressesPath}`);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

  // Connect to CreditScore
  const CreditScore = await ethers.getContractFactory("CreditScore");
  const creditScore = CreditScore.attach(addresses.CreditScore);

  // Get score
  const scoreData = await creditScore.getScore(user.address);

  console.log("\n=== Credit Score ===");
  console.log("Score:", scoreData.score.toString(), "/ 1000");
  console.log("Last Updated:", new Date(Number(scoreData.lastUpdated) * 1000).toLocaleString());
  console.log("Total Loans:", scoreData.totalLoans.toString());
  console.log("Total Repaid:", scoreData.totalRepaid.toString());
  console.log("KYC Verified:", scoreData.kycVerified ? "✓ Yes" : "✗ No");

  // Rating
  const score = Number(scoreData.score);
  let rating = "";
  if (score >= 800) rating = "Excellent";
  else if (score >= 700) rating = "Good";
  else if (score >= 600) rating = "Fair";
  else if (score >= 500) rating = "Poor";
  else rating = "Very Poor";

  console.log("\nRating:", rating);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
