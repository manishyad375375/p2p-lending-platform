# Complete Localhost Setup Guide - From Fresh Download

## Step 1: Download Repository

### Option A: Using Git
```bash
git clone https://github.com/manishyad375375/p2p-lending-platform.git
cd p2p-lending-platform
```

### Option B: Download ZIP
1. Go to https://github.com/manishyad375375/p2p-lending-platform
2. Click "Code" → "Download ZIP"
3. Extract to: `C:\Users\YourName\Documents\p2p-lending-platform`
4. Open Command Prompt or PowerShell:
   ```bash
   cd C:\Users\YourName\Documents\p2p-lending-platform
   ```

---

## Step 2: Check Prerequisites

### Required Software

**1. Node.js (v18 or v20 LTS)**
```bash
# Check if installed
node --version
# Should show: v18.x.x or v20.x.x
```

If not installed:
- Download from: https://nodejs.org/
- Choose "LTS" version (v20.x)
- Install and restart terminal

**2. npm (comes with Node.js)**
```bash
npm --version
# Should show: 9.x.x or 10.x.x
```

**3. MetaMask Browser Extension**
- Install from: https://metamask.io/download/
- Create wallet if you don't have one

---

## Step 3: Install All Dependencies

```bash
# In project root
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

**Expected time:** 2-5 minutes

---

## Step 4: Compile Smart Contracts

```bash
# Clean any old artifacts
npx hardhat clean

# Compile contracts
npx hardhat compile
```

**Expected output:**
```
Compiling 6 files with 0.8.20
Compilation finished successfully
```

If you get errors, see [Troubleshooting](#troubleshooting) section.

---

## Step 5: Start Local Blockchain

**Open Terminal/PowerShell Window 1:**

```bash
npx hardhat node
```

**Expected output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
```

**⚠️ IMPORTANT: Leave this terminal running!** This is your local blockchain.

---

## Step 6: Deploy Contracts to Localhost

**Open Terminal/PowerShell Window 2:**

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Expected output:**
```
=== P2P Lending Platform Deployment ===
Deploying contracts with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

1. Deploying PlatformToken...
   ✓ PlatformToken deployed: 0x5FbDB2315678afecb367f032d93F642f64180aa3

2. Deploying Governance...
   ✓ Governance deployed: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

3. Deploying LendingPool...
   ✓ LendingPool deployed: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

4. Deploying CreditScore...
   ✓ CreditScore deployed: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9

5. Deploying KYCRegistry...
   ✓ KYCRegistry deployed: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9

6. Deploying FlashLoan...
   ✓ FlashLoan deployed: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707

Deployment data saved to: deployments/localhost.json
```

**📝 Note down these addresses** - you'll need them for the frontend!

---

## Step 7: Initialize Test Data

```bash
# Initialize your account with KYC and credit score
npx hardhat run scripts/initialize-testnet.js --network localhost
```

**Expected output:**
```
=== Setting up test data ===

1. Setting up KYC provider permissions...
✓ Deployer is now a KYC provider

2. Setting KYC status...
✓ Deployer address verified via KYC

3. Granting score updater permission...
✓ Deployer can now update credit scores

4. Initializing credit score...
✓ Credit score initialized to 500/1000

=== Initialization Complete ===
```

If this fails with "function not found" errors, run this instead:

```bash
# Create quick init script
cat > scripts/quick-init.js << 'EOF'
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const addresses = JSON.parse(fs.readFileSync("./deployments/localhost.json", "utf8"));

  const KYC = await ethers.getContractFactory("KYCRegistry");
  const Score = await ethers.getContractFactory("CreditScore");
  const kyc = KYC.attach(addresses.KYCRegistry);
  const score = Score.attach(addresses.CreditScore);

  console.log("Setting up account...");
  
  let tx = await kyc.setProvider(deployer.address, true);
  await tx.wait();
  console.log("✓ KYC provider set");

  tx = await kyc.setKYC(deployer.address, true);
  await tx.wait();
  console.log("✓ KYC verified");

  tx = await score.setUpdater(deployer.address, true);
  await tx.wait();
  console.log("✓ Score updater set");

  tx = await score.updateScore(deployer.address, 500, 0, 0, true);
  await tx.wait();
  console.log("✓ Score initialized: 500/1000");
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
EOF

# Run it
npx hardhat run scripts/quick-init.js --network localhost
```

---

## Step 8: Create Test Pool

```bash
npx hardhat run scripts/create-test-pool.js --network localhost
```

**Expected output:**
```
Deploying mock USDC...
Mock USDC deployed to: 0x0165878A594ca255338adfa4d48449f69242Eb8F
Minted 10,000 mock USDC to deployer

Creating lending pool...
Pool created with ID: 0x...

=== Test Pool Configuration ===
Mock USDC Address: 0x0165878A594ca255338adfa4d48449f69242Eb8F
Pool ID: 0x...
LTV: 75%
Base Rate: 2%
```

**📝 Save the Mock USDC address!**

---

## Step 9: Setup MetaMask

### 9.1: Add Localhost Network

1. Open MetaMask
2. Click network dropdown (top)
3. Click "Add Network"
4. Click "Add a network manually"
5. Fill in:
   - **Network Name:** `Localhost 8545`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
6. Click "Save"

### 9.2: Import Test Account

1. Click MetaMask account icon
2. Click "Import Account"
3. Select "Private Key"
4. Paste this:
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
5. Click "Import"

**✅ You should now see ~10,000 ETH!**

---

## Step 10: Configure Frontend

### Create `frontend/.env` file:

**Windows (Command Prompt):**
```cmd
cd frontend
copy nul .env
notepad .env
```

**Windows (PowerShell):**
```powershell
cd frontend
New-Item .env
notepad .env
```

**Paste this content:**
```bash
VITE_WALLETCONNECT_PROJECT_ID=demo-project-id
VITE_API_URL=http://localhost:3001
VITE_CHAIN_ID=31337

# Replace with YOUR addresses from Step 6!
VITE_LENDING_POOL_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
VITE_CREDIT_SCORE_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
VITE_KYC_REGISTRY_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
VITE_PLATFORM_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_GOVERNANCE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

**💡 Tip:** Look at `deployments/localhost.json` for exact addresses.

Save and close.

---

## Step 11: Configure Backend (Optional but Recommended)

### Create `backend/.env` file:

```cmd
cd backend
copy nul .env
notepad .env
```

**Paste this content:**
```bash
PORT=3001
NODE_ENV=development

# Blockchain
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CHAIN_ID=31337

# Replace with YOUR addresses from Step 6!
LENDING_POOL_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
CREDIT_SCORE_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
KYC_REGISTRY_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
PLATFORM_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
GOVERNANCE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

# Auth
JWT_SECRET=local_development_secret_key_12345
JWT_EXPIRES_IN=7d

# Admin
ADMIN_ADDRESSES=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

Save and close.

---

## Step 12: Start Frontend

**Open Terminal/PowerShell Window 3:**

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**✅ Frontend is running!**

---

## Step 13: Start Backend

**Open Terminal/PowerShell Window 4:**

```bash
cd backend
npm run dev
```

**Expected output:**
```
Blockchain provider initialized
Signer address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Server running on port 3001
Network: 31337
```

**✅ Backend is running!**

---

## Step 14: Test the Platform!

### 14.1: Open the Frontend

1. Open browser: http://localhost:3000
2. You should see "P2P Lending Platform" homepage

### 14.2: Connect Wallet

1. Click "Connect Wallet" (top right)
2. Select "MetaMask"
3. MetaMask will popup
4. Click "Next" → "Connect"
5. Make sure you're on "Localhost 8545" network

**✅ You should see your address connected with ~10,000 ETH!**

### 14.3: Check Your Profile

1. Click "Profile" in navigation
2. You should see:
   - Your wallet address
   - KYC Status: ✓ Verified
   - Credit Score: 500/1000

### 14.4: Get Mock USDC Tokens

In terminal (Window 2):

```bash
npx hardhat run scripts/mint-tokens.js --network localhost
```

**Output:**
```
Minting 10,000 Mock USDC...
✓ Minted successfully!
New balance: 10000.0 USDC

You can now deposit this USDC in the frontend!
```

### 14.5: Test Deposit

1. Go to "Pools" page
2. In "Deposit" card:
   - Enter amount: `100`
   - Click "Deposit"
3. MetaMask will popup
   - Review transaction
   - Click "Confirm"
4. Wait for confirmation
5. Your position should update!

### 14.6: Test Borrow

1. In "Borrow" card:
   - Enter amount: `50` (max 75% of deposit)
   - Click "Borrow"
2. Confirm in MetaMask
3. Your borrowed balance should update!

---

## 🎉 Success!

You now have:

✅ **Terminal 1:** Local blockchain running  
✅ **Terminal 2:** Available for commands  
✅ **Terminal 3:** Frontend running (http://localhost:3000)  
✅ **Terminal 4:** Backend running (http://localhost:3001)  
✅ **MetaMask:** Connected with 10,000 ETH  
✅ **Profile:** KYC verified, Credit Score 500  
✅ **Pools:** Can deposit and borrow  

---

## 🛠️ Useful Commands

### Check Your Status

```bash
# Check balance
npx hardhat run scripts/check-balance.js --network localhost

# Check KYC
npx hardhat run scripts/check-kyc.js --network localhost

# Check credit score
npx hardhat run scripts/check-score.js --network localhost

# Check position
npx hardhat run scripts/check-position.js --network localhost
```

### Reset Everything

If you want to start fresh:

1. Stop all terminals (Ctrl+C)
2. Delete deployment data:
   ```bash
   del deployments\localhost.json
   ```
3. Restart from Step 5 (start blockchain)

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Issue: "Port 8545 already in use"

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :8545
taskkill /PID <PID> /F

# Then restart hardhat node
npx hardhat node
```

### Issue: "Nonce too high" in MetaMask

**Solution:**
1. Open MetaMask
2. Settings → Advanced
3. Click "Reset Account"
4. Refresh page

### Issue: "Transaction failed"

**Check:**
1. You're on "Localhost 8545" network
2. You have ETH for gas
3. Contract addresses are correct in `.env`
4. Hardhat node is still running (Terminal 1)

### Issue: Frontend shows "Connect Wallet" but MetaMask is connected

**Solution:**
1. Disconnect from site in MetaMask
2. Refresh page
3. Connect again

### Issue: "function is not a function" errors

**Solution:**
```bash
npx hardhat clean
rmdir /s /q artifacts
rmdir /s /q cache
npm install
npx hardhat compile
```

Then redeploy from Step 6.

### Issue: Windows "UV_HANDLE_CLOSING" error

**This is normal on Windows!** If the command completed successfully (you see "✓ Done" or similar), ignore this error. It's a Hardhat + Windows bug.

**To minimize:**
- Use Node.js v20 LTS (not v21+)
- Or use WSL2 (Windows Subsystem for Linux)

---

## 📁 Project Structure

```
p2p-lending-platform/
├── contracts/              # Smart contracts (Solidity)
│   ├── LendingPool.sol
│   ├── CreditScore.sol
│   ├── KYCRegistry.sol
│   ├── PlatformToken.sol
│   ├── Governance.sol
│   └── FlashLoan.sol
├── scripts/               # Deployment & utility scripts
│   ├── deploy.js
│   ├── initialize-testnet.js
│   ├── create-test-pool.js
│   ├── mint-tokens.js
│   └── check-*.js
├── frontend/              # React application
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   └── components/
│   ├── package.json
│   └── .env              # ← You create this
├── backend/               # Express API
│   ├── server.js
│   ├── package.json
│   └── .env              # ← You create this
├── deployments/           # Auto-generated
│   └── localhost.json    # Contract addresses
├── hardhat.config.js
└── package.json
```

---

## 📚 What Each Part Does

### Smart Contracts
- **LendingPool**: Deposit, borrow, repay functionality
- **CreditScore**: Track user creditworthiness (0-1000)
- **KYCRegistry**: Store identity verification status
- **PlatformToken**: Governance token (P2PL)
- **Governance**: DAO voting system
- **FlashLoan**: Instant loans with same-transaction repayment

### Frontend (React)
- **Dashboard**: Overview of your positions
- **Pools**: Deposit and borrow interface
- **Profile**: KYC status and credit score
- **Governance**: Create and vote on proposals

### Backend (Express)
- REST API for blockchain data
- KYC management endpoints
- Credit score calculation
- User statistics

---

## 🚀 Next Steps

1. **Explore the UI**
   - Try all pages
   - Test deposit/borrow/repay
   - Create a governance proposal

2. **Customize**
   - Modify interest rates
   - Change LTV ratios
   - Add new pool types

3. **Deploy to Testnet**
   - When ready, deploy to Sepolia
   - See `DEPLOYMENT.md` guide

4. **Add Features**
   - Liquidation mechanism
   - Flash loan UI
   - Analytics dashboard

---

## 📞 Need Help?

If you're stuck:

1. Check this guide again
2. Look at error messages carefully
3. Check all 4 terminals are running
4. Verify `.env` files are correct
5. Try the troubleshooting section

---

**You're all set! Happy coding! 🎉**

**Last Updated:** December 14, 2025
