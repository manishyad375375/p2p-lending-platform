# Localhost Deployment Guide

Complete step-by-step guide to run the P2P Lending Platform on your local machine.

## Prerequisites

Make sure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Check version: `node --version`

2. **npm** (comes with Node.js)
   - Check version: `npm --version`

3. **Git**
   - Download: https://git-scm.com/
   - Check version: `git --version`

4. **MetaMask Browser Extension**
   - Install: https://metamask.io/download/

### Optional (for backend)

5. **PostgreSQL** (for production-like backend)
   - Download: https://www.postgresql.org/download/
   - Or use Docker: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`

6. **Redis** (for caching)
   - Download: https://redis.io/download/
   - Or use Docker: `docker run -p 6379:6379 redis`

## Step-by-Step Deployment

### Step 1: Clone the Repository

```bash
# Clone the repo
git clone https://github.com/manishyad375375/p2p-lending-platform.git

# Navigate to project directory
cd p2p-lending-platform
```

### Step 2: Install Root Dependencies

```bash
# Install Hardhat and contract dependencies
npm install
```

This installs:
- Hardhat (Ethereum development environment)
- OpenZeppelin contracts
- ethers.js
- Solidity compiler

### Step 3: Compile Smart Contracts

```bash
# Compile all Solidity contracts
npx hardhat compile
```

**Expected output:**
```
Compiling 6 files with 0.8.20
Compilation finished successfully
```

### Step 4: Start Local Blockchain

Open a **new terminal window** (keep it running):

```bash
# Start local Hardhat node
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

**⚠️ Keep this terminal running!** This is your local blockchain.

### Step 5: Deploy Contracts to Localhost

Open a **new terminal** (second terminal):

```bash
# Deploy all contracts
npx hardhat run scripts/deploy.js --network localhost
```

**Expected output:**
```
=== P2P Lending Platform Deployment ===
Deploying contracts with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Network: localhost

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

=== Deployment Summary ===
Deployment data saved to: deployments/localhost.json
```

**📝 Important:** Copy these contract addresses. You'll need them for the frontend.

### Step 6: Initialize Test Data

```bash
# Set up KYC and credit score for test account
npx hardhat run scripts/initialize-testnet.js --network localhost
```

**Expected output:**
```
=== Setting up test data ===

1. Setting KYC status...
✓ Deployer address verified via KYC

2. Granting score updater permission...
✓ Deployer can now update credit scores

3. Initializing credit score...
✓ Credit score initialized to 500/1000

=== Initialization Complete ===
```

### Step 7: Create Test Pool

```bash
# Create a test lending pool with mock USDC
npx hardhat run scripts/create-test-pool.js --network localhost
```

**Expected output:**
```
Deploying mock USDC...
Mock USDC deployed to: 0x0165878A594ca255338adfa4d48449f69242Eb8F
Minted 10,000 mock USDC to deployer

Creating lending pool...
Pool created with ID: 0x1234...

=== Test Pool Configuration ===
Mock USDC Address: 0x0165878A594ca255338adfa4d48449f69242Eb8F
Pool ID: 0x1234...
LTV: 75%
Base Rate: 2%
```

**📝 Save the Mock USDC address!** You'll use it to test deposits/borrows.

### Step 8: Configure MetaMask

#### 8.1 Add Localhost Network to MetaMask

1. Open MetaMask
2. Click network dropdown (top)
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   - **Network Name:** Localhost 8545
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH
5. Click "Save"

#### 8.2 Import Test Account

1. In MetaMask, click account icon → "Import Account"
2. Select "Private Key"
3. Paste this test private key:
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
4. Click "Import"

**✅ You should now see ~10,000 ETH in your account!**

### Step 9: Configure Frontend

Create `frontend/.env` file:

```bash
# Navigate to frontend
cd frontend

# Create .env file
cat > .env << 'EOF'
VITE_WALLETCONNECT_PROJECT_ID=demo-project-id
VITE_API_URL=http://localhost:3001
VITE_CHAIN_ID=31337

# Copy these addresses from deployments/localhost.json
VITE_LENDING_POOL_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
VITE_CREDIT_SCORE_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
VITE_KYC_REGISTRY_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
VITE_PLATFORM_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_GOVERNANCE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
EOF
```

**⚠️ Update the contract addresses** with your actual deployed addresses from Step 5!

### Step 10: Install Frontend Dependencies

```bash
# Still in frontend directory
npm install
```

This installs:
- React & React DOM
- Vite (build tool)
- TailwindCSS
- wagmi & RainbowKit (Web3 libraries)
- ethers.js
- React Router

### Step 11: Start Frontend

In the same terminal (frontend directory):

```bash
npm run dev
```

**Expected output:**
```
VITE v5.0.10  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**✅ Frontend is now running at http://localhost:3000**

### Step 12: Configure Backend (Optional)

Open a **new terminal** (third terminal):

```bash
# Navigate to backend
cd backend

# Create .env file
cat > .env << 'EOF'
PORT=3001
NODE_ENV=development

# Blockchain
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CHAIN_ID=31337

# Contract Addresses (update with your addresses)
LENDING_POOL_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
CREDIT_SCORE_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
KYC_REGISTRY_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
PLATFORM_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
GOVERNANCE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

# Database (optional - skip for MVP testing)
# DATABASE_URL=postgresql://postgres:password@localhost:5432/p2p_lending
# REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=local_development_secret_key
JWT_EXPIRES_IN=7d

# Admin
ADMIN_ADDRESSES=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
EOF
```

### Step 13: Install Backend Dependencies

```bash
# Still in backend directory
npm install
```

### Step 14: Start Backend

```bash
npm run dev
```

**Expected output:**
```
Server running on port 3001 in development mode
Blockchain provider initialized with signer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**✅ Backend is now running at http://localhost:3001**

## 🎉 Testing the Platform

### Test Flow

Now you have everything running! Here's how to test:

#### 1. Open the Frontend

- Go to http://localhost:3000
- You should see the P2P Lending Platform homepage

#### 2. Connect Wallet

- Click "Connect Wallet" button (top right)
- Select MetaMask
- Make sure you're on "Localhost 8545" network
- Approve the connection

**✅ You should see your address connected with ~10,000 ETH**

#### 3. Check Your Profile

- Click "Profile" in navigation
- You should see:
  - ✅ KYC Status: Verified
  - ✅ Credit Score: 500/1000
  - Your wallet address

#### 4. View Pools

- Click "Lending Pools" in navigation
- Enter the Mock USDC address from Step 7
- You should see your position (0 deposited, 0 borrowed)

#### 5. Get Mock USDC

You need to mint some mock USDC to yourself:

```bash
# In a terminal, run:
npx hardhat run scripts/mint-tokens.js --network localhost
```

(I'll add this script below)

#### 6. Approve and Deposit

In the frontend:
1. Enter amount to deposit (e.g., 100)
2. First click will approve the LendingPool to spend your USDC
3. Second click will deposit

**✅ You should see your deposited balance update!**

#### 7. Borrow

1. Enter amount to borrow (max 75% of your deposit due to 75% LTV)
2. Click "Borrow"
3. Confirm transaction

**✅ You should see your borrowed balance update!**

#### 8. Repay

1. Enter amount to repay
2. Click "Repay" (would need to add this button)
3. Confirm transaction

## 📁 Project Structure When Running

```
p2p-lending-platform/
├── Terminal 1: npx hardhat node (blockchain)
├── Terminal 2: cd frontend && npm run dev (frontend)
├── Terminal 3: cd backend && npm run dev (backend)
└── Browser: http://localhost:3000
```

## 🛠️ Useful Commands

### Check Contract State

```bash
# Check your positions in a pool
npx hardhat run scripts/check-position.js --network localhost

# Check your credit score
npx hardhat run scripts/check-score.js --network localhost

# Check KYC status
npx hardhat run scripts/check-kyc.js --network localhost
```

### Reset Blockchain

If you want to start fresh:

1. Stop Hardhat node (Ctrl+C in Terminal 1)
2. Delete `deployments/localhost.json`
3. Start node again: `npx hardhat node`
4. Re-deploy: `npx hardhat run scripts/deploy.js --network localhost`

### Clear Frontend Cache

```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

## ❌ Troubleshooting

### Issue: "Error: could not detect network"

**Solution:** Make sure Hardhat node is running in Terminal 1

### Issue: "Nonce too high" in MetaMask

**Solution:** 
1. Open MetaMask
2. Settings → Advanced → Reset Account
3. Refresh the page

### Issue: Contract addresses not found

**Solution:** 
1. Check `deployments/localhost.json` exists
2. Copy addresses to `frontend/.env`
3. Restart frontend

### Issue: "Cannot connect to backend"

**Solution:** 
- Backend is optional for basic testing
- Make sure port 3001 is not in use
- Check `backend/.env` is configured

### Issue: Transactions fail

**Solution:**
1. Check you have enough ETH (gas)
2. Check you approved token spending
3. Check contract addresses are correct
4. Look at Hardhat node logs for errors

### Issue: MetaMask shows wrong chain

**Solution:**
1. Manually switch to "Localhost 8545" network
2. If not listed, add it again (Step 8.1)

## 📊 What You Have Running

✅ **Local Blockchain** (Terminal 1)
- Hardhat node on port 8545
- 10,000 ETH per account
- Fast block times
- Instant transactions

✅ **Smart Contracts** (Deployed)
- LendingPool with deposit/borrow/repay
- CreditScore with on-chain scoring
- KYCRegistry for identity
- PlatformToken (P2PL)
- Governance for DAO voting
- FlashLoan provider

✅ **Frontend** (Terminal 2)
- React app on port 3000
- Wallet connection via RainbowKit
- Pool interaction UI
- Profile with KYC/score
- Dashboard

✅ **Backend** (Terminal 3 - Optional)
- Express API on port 3001
- KYC endpoints
- Credit score computation
- Analytics APIs

## 🎯 Next Steps

1. ✅ Test deposit functionality
2. ✅ Test borrow functionality  
3. ✅ Test repay functionality
4. ✅ Test credit score updates
5. ✅ Test KYC verification flow
6. ✅ Add more test pools
7. ✅ Test governance proposals
8. ✅ Test flash loans
9. ✅ Fix any bugs
10. ✅ Deploy to testnet when ready

## 🔗 Useful Links

- Hardhat Docs: https://hardhat.org/
- React Docs: https://react.dev/
- ethers.js Docs: https://docs.ethers.org/v6/
- RainbowKit Docs: https://www.rainbowkit.com/
- TailwindCSS Docs: https://tailwindcss.com/

## 💡 Development Tips

1. **Keep Hardhat node running** - If it stops, you lose all state
2. **Use console.log in contracts** - Hardhat shows them in Terminal 1
3. **Check MetaMask network** - Always verify you're on Localhost 8545
4. **Save deployment addresses** - Keep `deployments/localhost.json` safe
5. **Test incrementally** - Test each feature before moving to next

## 🎊 Success!

If you see:
- ✅ Wallet connected
- ✅ KYC verified
- ✅ Credit score showing
- ✅ Can deposit/borrow

**Congratulations! Your P2P Lending Platform is running locally! 🚀**
