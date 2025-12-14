# IPFS Serverless Deployment Guide

## 🌐 Deploy Your P2P Lending Platform as a Fully Decentralized dApp

**What is Serverless/IPFS?**
- No backend servers needed
- Frontend hosted on IPFS (decentralized storage)
- Smart contracts on blockchain
- 100% decentralized
- Censorship-resistant
- Free forever (with some services)

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│                                             │
│  Frontend (React) → IPFS via Fleek/Pinata │
│  Smart Contracts → Ethereum/Polygon        │
│  No Backend Server! Direct Web3 calls      │
│                                             │
└─────────────────────────────────────────────┘
```

**What We Remove:**
- ❌ Backend API server (Express)
- ❌ Centralized hosting (Vercel/Railway)
- ❌ Monthly server costs

**What We Keep:**
- ✅ Frontend React app
- ✅ Smart contracts on blockchain
- ✅ MetaMask wallet connection
- ✅ Direct contract calls from browser

---

## Part 1: Prepare Frontend for Serverless

### Step 1: Remove Backend Dependencies

The frontend already works without backend! We just need to optimize it.

**Update `frontend/src/pages/Profile.jsx`:**

```javascript
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const KYC_ABI = ['function isKycVerified(address) view returns (bool)'];
const SCORE_ABI = ['function getScore(address) view returns (uint256 score, uint256 lastUpdated, uint256 totalLoans, uint256 totalRepaid, bool kycVerified)'];

const Profile = () => {
  const [account, setAccount] = useState(null);
  const [stats, setStats] = useState(null);

  const KYC_ADDRESS = import.meta.env.VITE_KYC_REGISTRY_ADDRESS;
  const SCORE_ADDRESS = import.meta.env.VITE_CREDIT_SCORE_ADDRESS;
  const RPC_URL = import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:8545';

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            fetchStatsFromContract(accounts[0]);
          }
        });
    }
  }, []);

  const fetchStatsFromContract = async (address) => {
    try {
      // Use MetaMask provider or fallback to RPC
      const provider = window.ethereum 
        ? new ethers.BrowserProvider(window.ethereum)
        : new ethers.JsonRpcProvider(RPC_URL);

      const kyc = new ethers.Contract(KYC_ADDRESS, KYC_ABI, provider);
      const score = new ethers.Contract(SCORE_ADDRESS, SCORE_ABI, provider);

      const kycVerified = await kyc.isKycVerified(address);
      const scoreData = await score.getScore(address);

      setStats({
        kyc: { verified: kycVerified },
        creditScore: {
          score: scoreData.score.toString(),
          lastUpdated: scoreData.lastUpdated.toString(),
          totalLoans: scoreData.totalLoans.toString(),
          totalRepaid: scoreData.totalRepaid.toString()
        }
      });
    } catch (error) {
      console.error('Error fetching from contracts:', error);
    }
  };

  // ... rest of component (same as before)
};
```

### Step 2: Update Dashboard for Direct Contract Calls

**Update `frontend/src/pages/Dashboard.jsx`:**

```javascript
// Same changes as Profile - fetch directly from contracts
// Remove all fetch() calls to backend API
// Use ethers.js to read from contracts directly
```

---

## Part 2: Deploy to IPFS via Fleek (Easiest)

### Step 1: Sign Up for Fleek

1. Go to https://app.fleek.co/
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Fleek

### Step 2: Connect Repository

1. Click "Add New Site"
2. Select "Deploy with Fleek"
3. Choose your GitHub repo: `p2p-lending-platform`
4. Click "Continue"

### Step 3: Configure Build Settings

**Framework:** Other

**Build Settings:**
```
Build Command: cd frontend && npm install && npm run build
Publish Directory: frontend/dist
Docker Image: fleek/node:18
```

**Environment Variables:**
```bash
# For Sepolia testnet
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

VITE_LENDING_POOL_ADDRESS=0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7
VITE_CREDIT_SCORE_ADDRESS=0x4745d42273b6f72d882ef07be3b94f9c38a797e4
VITE_KYC_REGISTRY_ADDRESS=0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9
VITE_PLATFORM_TOKEN_ADDRESS=0x39753a2eb235e022903e3D9D01D378f54ada487D
VITE_GOVERNANCE_ADDRESS=0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c
```

### Step 4: Deploy

1. Click "Deploy Site"
2. Wait 3-5 minutes
3. You get:
   - **IPFS Hash:** `ipfs://Qm...`
   - **Fleek URL:** `https://your-site.on.fleek.co`
   - **IPFS Gateway:** `https://ipfs.fleek.co/ipfs/Qm...`

### Step 5: Setup ENS Domain (Optional)

1. Buy ENS at https://app.ens.domains/
2. In Fleek: Settings → Domain Management
3. Click "Add ENS"
4. Enter your `.eth` domain
5. Follow instructions to update ENS records
6. **Result:** Users access via `yourapp.eth`

---

## Part 3: Deploy to IPFS via Pinata (Manual)

### Step 1: Build Frontend

```bash
cd frontend

# Set environment variables
cat > .env.production << 'EOF'
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
VITE_LENDING_POOL_ADDRESS=0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7
VITE_CREDIT_SCORE_ADDRESS=0x4745d42273b6f72d882ef07be3b94f9c38a797e4
VITE_KYC_REGISTRY_ADDRESS=0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9
VITE_PLATFORM_TOKEN_ADDRESS=0x39753a2eb235e022903e3D9D01D378f54ada487D
VITE_GOVERNANCE_ADDRESS=0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c
EOF

# Build
npm run build
```

This creates `frontend/dist/` folder.

### Step 2: Upload to Pinata

1. Go to https://pinata.cloud/
2. Sign up for free account
3. Click "Upload" → "Folder"
4. Select `frontend/dist` folder
5. Click "Upload"
6. Wait for upload to complete
7. Copy IPFS hash: `Qm...`

### Step 3: Access Your dApp

**Via IPFS Gateways:**
- Pinata: `https://gateway.pinata.cloud/ipfs/YOUR_HASH`
- Cloudflare: `https://cloudflare-ipfs.com/ipfs/YOUR_HASH`
- IPFS.io: `https://ipfs.io/ipfs/YOUR_HASH`

**Via IPFS Desktop/Browser:**
- Brave browser: `ipfs://YOUR_HASH`
- IPFS Desktop: `ipfs://YOUR_HASH`

---

## Part 4: Deploy to IPFS via CLI (Advanced)

### Step 1: Install IPFS

**Windows:**
```bash
# Download from https://dist.ipfs.tech/#go-ipfs
# Or use Chocolatey:
choco install ipfs
```

**Linux/Mac:**
```bash
wget https://dist.ipfs.tech/go-ipfs/v0.17.0/go-ipfs_v0.17.0_linux-amd64.tar.gz
tar -xvzf go-ipfs_v0.17.0_linux-amd64.tar.gz
cd go-ipfs
sudo bash install.sh
```

### Step 2: Initialize IPFS

```bash
ipfs init
ipfs daemon
```

Keep daemon running in background.

### Step 3: Add Your Frontend to IPFS

```bash
cd frontend
npm run build

# Add to IPFS
ipfs add -r dist/

# Copy the final hash (last line)
# Example: added QmXxxx... dist
```

### Step 4: Pin Your Content

```bash
# Keep your content online
ipfs pin add YOUR_HASH

# Or use a pinning service
ipfs pin remote add --service=pinata YOUR_HASH
```

### Step 5: Access Your dApp

```
ipfs://YOUR_HASH
```

---

## Part 5: Use The Graph for Data (Optional)

Instead of backend API, use The Graph to index blockchain data.

### Step 1: Create Subgraph

```bash
npm install -g @graphprotocol/graph-cli

graph init --product hosted-service your-username/p2p-lending
```

### Step 2: Define Schema

**subgraph.yaml:**
```yaml
specVersion: 0.0.4
description: P2P Lending Platform
repository: https://github.com/your/repo
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: LendingPool
    network: sepolia
    source:
      address: "0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7"
      abi: LendingPool
      startBlock: 0
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      file: ./src/mapping.ts
      entities:
        - User
        - Position
      abis:
        - name: LendingPool
          file: ./abis/LendingPool.json
      eventHandlers:
        - event: Deposited(indexed bytes32,indexed address,uint256)
          handler: handleDeposit
        - event: Borrowed(indexed bytes32,indexed address,uint256)
          handler: handleBorrow
```

**schema.graphql:**
```graphql
type User @entity {
  id: ID!
  deposited: BigInt!
  borrowed: BigInt!
  kycVerified: Boolean!
  creditScore: Int!
}

type Position @entity {
  id: ID!
  user: User!
  poolId: Bytes!
  deposited: BigInt!
  borrowed: BigInt!
}
```

### Step 3: Deploy Subgraph

```bash
graph auth --product hosted-service YOUR_ACCESS_TOKEN
graph deploy --product hosted-service your-username/p2p-lending
```

### Step 4: Query from Frontend

```javascript
const query = `
  query {
    user(id: "${address.toLowerCase()}") {
      deposited
      borrowed
      creditScore
    }
  }
`;

const response = await fetch('https://api.thegraph.com/subgraphs/name/your-username/p2p-lending', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
});
```

---

## Part 6: Complete Serverless Architecture

```
┌──────────────────────────────────────────────┐
│                                              │
│  User Browser                                │
│  ├── React App (from IPFS)                  │
│  ├── ethers.js (Web3 provider)              │
│  └── MetaMask (wallet)                      │
│                                              │
└────────────┬─────────────────────────────────┘
             │
             ├─────────────────┐
             │                 │
             ▼                 ▼
    ┌────────────────┐  ┌──────────────┐
    │ Smart Contracts│  │  The Graph   │
    │   (Ethereum)   │  │  (Optional)  │
    └────────────────┘  └──────────────┘
```

**No servers, no backend, 100% decentralized!**

---

## Part 7: Access Methods

### Option 1: IPFS Gateway (Web Browser)
```
https://gateway.pinata.cloud/ipfs/YOUR_HASH
https://cloudflare-ipfs.com/ipfs/YOUR_HASH
https://ipfs.io/ipfs/YOUR_HASH
```

### Option 2: ENS Domain
```
https://yourapp.eth.limo
https://yourapp.eth.link
```

### Option 3: Native IPFS
```
ipfs://YOUR_HASH
```
*Requires Brave browser or IPFS companion*

### Option 4: Fleek Domain
```
https://your-site.on.fleek.co
```

---

## Part 8: Benefits of Serverless/IPFS

### Advantages:

✅ **No Monthly Costs** - IPFS hosting is free
✅ **Censorship-Resistant** - Can't be taken down
✅ **Decentralized** - No single point of failure
✅ **Permanent** - Content stays online forever (if pinned)
✅ **Fast** - CDN-like distribution
✅ **Trustless** - Users verify directly with blockchain
✅ **No Backend Exploits** - No server to hack

### Limitations:

⚠️ **Initial Load** - First access may be slow
⚠️ **No Dynamic Backend** - Can't run server-side code
⚠️ **Read-Only APIs** - Need The Graph for complex queries
⚠️ **IPFS Gateway Dependency** - Need gateway for regular browsers

---

## Part 9: Cost Comparison

| Deployment Type | Setup Cost | Monthly Cost | Notes |
|----------------|------------|--------------|-------|
| **IPFS + Fleek** | $0 | $0 | Free tier |
| **IPFS + Pinata** | $0 | $0-$20 | Free 1GB |
| **Traditional (Vercel+Railway)** | $0 | $25-75 | Need servers |
| **Traditional (AWS)** | $0 | $50-200 | Need servers |
| **ENS Domain** | $5-20 | $5-20/year | Optional |

**IPFS is 100% free (with limitations)!**

---

## Part 10: Quick Deploy Commands

### Deploy to Fleek (Automated):

```bash
# 1. Push to GitHub
git add .
git commit -m "Prepare for IPFS deployment"
git push

# 2. Go to Fleek dashboard
# 3. Connect repo
# 4. Deploy automatically

# Done! ✅
```

### Deploy to IPFS (Manual):

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Upload to Pinata
# Go to https://pinata.cloud
# Upload 'dist' folder

# 3. Get IPFS hash
# 4. Share: https://gateway.pinata.cloud/ipfs/YOUR_HASH

# Done! ✅
```

---

## Part 11: SEO & Discovery

**Problem:** IPFS sites are hard to discover.

**Solutions:**

1. **ENS Domain** - Easy to remember: `yourapp.eth`
2. **Custom Domain** - Point DNS to IPFS gateway
3. **DApp Directories:**
   - State of the DApps: https://www.stateofthedapps.com/
   - DappRadar: https://dappradar.com/
   - DeFi Llama: https://defillama.com/

4. **Social Media:**
   - Share on Twitter/X
   - Post on Reddit r/ethdev
   - Telegram groups
   - Discord communities

---

## Part 12: Update Your Deployed Site

### Fleek (Automatic):
```bash
# Just push to GitHub
git push

# Fleek rebuilds automatically
# New IPFS hash created
# ENS updated automatically (if configured)
```

### Pinata (Manual):
```bash
# 1. Build new version
cd frontend
npm run build

# 2. Upload to Pinata again
# 3. Unpin old version
# 4. Pin new version
# 5. Update ENS to new hash
```

---

## Part 13: Success Checklist

- [ ] Frontend built successfully
- [ ] Smart contracts deployed (Sepolia/Polygon)
- [ ] Environment variables configured
- [ ] Uploaded to IPFS
- [ ] IPFS hash obtained
- [ ] Accessible via gateway
- [ ] MetaMask connects
- [ ] Can deposit/borrow
- [ ] ENS domain (optional)
- [ ] Listed on dApp directories

---

## 🎉 Your dApp is Now Serverless!

**Access it via:**
- IPFS hash: `ipfs://YOUR_HASH`
- Gateway: `https://gateway.pinata.cloud/ipfs/YOUR_HASH`
- ENS: `yourapp.eth`
- Fleek: `https://your-site.on.fleek.co`

**No servers. No backend. 100% decentralized! 🚀**

---

## Resources

- **Fleek:** https://fleek.co/
- **Pinata:** https://pinata.cloud/
- **IPFS:** https://ipfs.tech/
- **The Graph:** https://thegraph.com/
- **ENS:** https://ens.domains/
- **IPFS Desktop:** https://docs.ipfs.tech/install/ipfs-desktop/

---

**Last Updated:** December 14, 2025
