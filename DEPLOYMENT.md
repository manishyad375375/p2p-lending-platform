# Testnet Deployment Guide

Complete guide to deploy the P2P Lending Platform on Sepolia and Mumbai testnets.

## Prerequisites

### 1. Get Testnet ETH and MATIC

**Sepolia (Ethereum Testnet)**
- Faucet 1: https://sepoliafaucet.com/
- Faucet 2: https://www.alchemy.com/faucets/ethereum-sepolia
- Faucet 3: https://faucet.quicknode.com/ethereum/sepolia

**Mumbai (Polygon Testnet)**
- Faucet 1: https://faucet.polygon.technology/
- Faucet 2: https://mumbaifaucet.com/

### 2. Get API Keys

**Infura** (for RPC access)
1. Sign up at https://infura.io/
2. Create a new project
3. Copy your API key

**Etherscan/Polygonscan** (for contract verification)
1. Etherscan: https://etherscan.io/register
2. Go to API Keys section
3. Create new API key
4. Polygonscan: https://polygonscan.com/register

**WalletConnect** (for frontend)
1. Sign up at https://cloud.walletconnect.com/
2. Create a new project
3. Copy Project ID

### 3. Setup Environment Variables

Create `.env` in project root:

```bash
# Your deployment wallet private key (with testnet ETH/MATIC)
PRIVATE_KEY=your_private_key_here

# RPC URLs
INFURA_API_KEY=your_infura_api_key

# Block explorers
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

## Deployment Steps

### Step 1: Install Dependencies

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..

# Backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Compile Contracts

```bash
npm run compile
```

Verify compilation succeeded with no errors.

### Step 3: Deploy to Sepolia

```bash
# Deploy all contracts
npm run deploy:sepolia

# Save the output! It will look like:
# PlatformToken deployed: 0x...
# Governance deployed: 0x...
# LendingPool deployed: 0x...
# CreditScore deployed: 0x...
# KYCRegistry deployed: 0x...
```

**Important**: Copy all contract addresses from the output.

### Step 4: Deploy to Mumbai (Optional)

```bash
npm run deploy:mumbai
```

### Step 5: Verify Contracts

Verify each contract on Etherscan/Polygonscan for transparency:

```bash
# Sepolia verification
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>

# Mumbai verification
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

Example:
```bash
npx hardhat verify --network sepolia 0x1234567890123456789012345678901234567890
```

### Step 6: Create Test Pool

After deployment, create a test lending pool:

```bash
node scripts/create-test-pool.js --network sepolia
```

### Step 7: Configure Frontend

Create `frontend/.env`:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_API_URL=http://localhost:3001
VITE_CHAIN_ID=11155111

# Paste your deployed contract addresses from Step 3
VITE_LENDING_POOL_ADDRESS=0x...
VITE_CREDIT_SCORE_ADDRESS=0x...
VITE_KYC_REGISTRY_ADDRESS=0x...
VITE_PLATFORM_TOKEN_ADDRESS=0x...
VITE_GOVERNANCE_ADDRESS=0x...
```

### Step 8: Configure Backend

Create `backend/.env`:

```bash
PORT=3001
NODE_ENV=development

# Database (optional for MVP testing)
DATABASE_URL=postgresql://user:password@localhost:5432/p2p_lending
REDIS_URL=redis://localhost:6379

# Blockchain
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_backend_signer_private_key
CHAIN_ID=11155111

# Contract Addresses (from Step 3)
LENDING_POOL_ADDRESS=0x...
CREDIT_SCORE_ADDRESS=0x...
KYC_REGISTRY_ADDRESS=0x...
PLATFORM_TOKEN_ADDRESS=0x...
GOVERNANCE_ADDRESS=0x...

# KYC Providers (optional for MVP)
CIVIC_API_KEY=
CIVIC_GATEWAY_TOKEN=
SELFKEY_API_KEY=
SELFKEY_API_URL=https://api.selfkey.org

# Auth
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=7d

# Admin
ADMIN_ADDRESSES=your_wallet_address
```

### Step 9: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 10: Test the Platform

1. Open http://localhost:3000
2. Connect your MetaMask wallet (switch to Sepolia network)
3. Go to "Pools" page
4. Try depositing test ETH
5. Try borrowing against your deposit
6. Check your credit score on "Profile" page

## Post-Deployment Tasks

### Set Up Test Data

Run the initialization script to set up test pools and mock KYC:

```bash
node scripts/initialize-testnet.js --network sepolia
```

This will:
- Create a test USDC pool
- Set your address as KYC verified
- Initialize your credit score to 500

### Grant Permissions

Grant the backend signer permission to update scores and KYC:

```bash
node scripts/grant-permissions.js --network sepolia
```

## Troubleshooting

### "Insufficient funds" Error
- Get more testnet ETH/MATIC from faucets
- Check your wallet balance: `npx hardhat run scripts/check-balance.js --network sepolia`

### "Nonce too high" Error
- Reset your MetaMask account: Settings → Advanced → Reset Account

### Deployment Fails
- Check gas prices are not too low
- Verify you have enough testnet ETH for deployment (~0.1 ETH recommended)
- Check network connectivity

### Contract Verification Fails
- Wait a few minutes after deployment
- Ensure you're using the exact same compiler version
- Check API key is valid

### Frontend Can't Connect to Contracts
- Verify contract addresses in `frontend/.env`
- Check you're on the correct network in MetaMask
- Clear browser cache and reload

## Network Information

### Sepolia Testnet
- Chain ID: 11155111
- RPC URL: https://sepolia.infura.io/v3/YOUR_KEY
- Block Explorer: https://sepolia.etherscan.io/
- Symbol: ETH

### Mumbai Testnet
- Chain ID: 80001
- RPC URL: https://polygon-mumbai.infura.io/v3/YOUR_KEY
- Block Explorer: https://mumbai.polygonscan.com/
- Symbol: MATIC

## Important Notes

1. **Never use mainnet private keys on testnet**
2. **Never commit `.env` files to Git**
3. **Testnet tokens have no real value**
4. **Testnet contracts can be wiped during network resets**
5. **Keep your deployment addresses documented**

## Next Steps After Testnet Deployment

1. ✅ Test all core features (deposit, borrow, repay)
2. ✅ Test KYC verification flow
3. ✅ Test credit score updates
4. ✅ Test governance proposals
5. ✅ Fix any bugs discovered
6. ✅ Run security tests
7. ✅ Get smart contract audit
8. ✅ Plan mainnet deployment

## Resources

- Hardhat Docs: https://hardhat.org/getting-started/
- Sepolia Faucets: https://faucetlink.to/sepolia
- Mumbai Faucets: https://faucet.polygon.technology/
- OpenZeppelin: https://docs.openzeppelin.com/
- Ethers.js: https://docs.ethers.org/v6/

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Hardhat console logs
3. Verify all environment variables are set
4. Check contract addresses are correct
5. Open an issue on GitHub
