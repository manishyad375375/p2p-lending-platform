# Complete Mainnet Deployment & Web3 Hosting Guide

## 🎯 Overview

This guide covers:
1. **Smart Contract Deployment** to Ethereum/Polygon Mainnet
2. **Frontend Deployment** to Web3 hosting (IPFS, Fleek, Vercel)
3. **Backend Deployment** to cloud services
4. **Domain Setup** with ENS or traditional DNS
5. **Security Checklist** before going live

---

## ⚠️ CRITICAL: Before Mainnet Deployment

### Security Requirements (NON-NEGOTIABLE)

- [ ] **Smart Contract Audit** by reputable firm (Certik, OpenZeppelin, Trail of Bits)
- [ ] **Unit Tests** with 100% coverage
- [ ] **Integration Tests** for all user flows
- [ ] **Testnet Testing** for minimum 2 weeks
- [ ] **Bug Bounty Program** setup
- [ ] **Emergency Pause Mechanism** implemented
- [ ] **Multisig Wallet** for admin functions (3-of-5 recommended)
- [ ] **Time Locks** on critical operations
- [ ] **Legal Review** and compliance check
- [ ] **Insurance** coverage arranged

**⚠️ DO NOT SKIP THESE STEPS! Users' real money is at stake.**

---

## Part 1: Smart Contract Deployment to Mainnet

### Option A: Ethereum Mainnet

#### Step 1: Get Real ETH

You'll need ~0.5-1 ETH for deployment and setup:
- Buy from exchanges: Coinbase, Binance, Kraken
- Transfer to your deployment wallet

**Estimated Costs:**
- PlatformToken: ~0.02 ETH
- Governance: ~0.03 ETH
- LendingPool: ~0.15 ETH
- CreditScore: ~0.05 ETH
- KYCRegistry: ~0.03 ETH
- FlashLoan: ~0.04 ETH
- Initialization: ~0.1 ETH
- **Total: ~0.42 ETH + buffer = 0.5-1 ETH**

#### Step 2: Setup Mainnet Config

Update `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
      gasPrice: "auto",
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
      gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
    },
  },
};
```

#### Step 3: Setup Environment

Create `.env.mainnet`:

```bash
# MAINNET DEPLOYMENT - KEEP SECURE!
MAINNET_PRIVATE_KEY=your_mainnet_wallet_private_key
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Multisig addresses
MULTISIG_ADMIN=0x...
TREASURY_MULTISIG=0x...
```

**⚠️ SECURITY WARNING:**
- Never commit `.env.mainnet` to Git
- Use hardware wallet (Ledger/Trezor) for deployment
- Store private keys in secure vault (1Password, Bitwarden)

#### Step 4: Deploy to Mainnet

```bash
# Double check you're ready
npm run test
npm run coverage

# Deploy to mainnet (REAL MONEY!)
npx hardhat run scripts/deploy.js --network mainnet

# Save output immediately
# Note all contract addresses
```

#### Step 5: Verify Contracts

```bash
# Verify all contracts on Etherscan
node scripts/verify-all.js mainnet
```

#### Step 6: Transfer Ownership to Multisig

```bash
# Transfer all admin functions to multisig
node scripts/transfer-ownership.js --network mainnet --multisig 0xYOUR_MULTISIG
```

---

### Option B: Polygon Mainnet (Cheaper Alternative)

**Advantages:**
- ~100x cheaper gas fees
- Faster transactions
- Ethereum-compatible

**Costs:**
- Total deployment: ~5-10 MATIC (~$5-10)

```bash
# Deploy to Polygon
npx hardhat run scripts/deploy.js --network polygon

# Verify on Polygonscan
node scripts/verify-all.js polygon
```

---

### Option C: Layer 2 Solutions

**Best for:** Lower costs, faster transactions

**Options:**
1. **Arbitrum** - Optimistic rollup
2. **Optimism** - Optimistic rollup
3. **zkSync** - Zero-knowledge rollup
4. **Base** - Coinbase L2

Add to `hardhat.config.js`:

```javascript
arbitrum: {
  url: "https://arb1.arbitrum.io/rpc",
  accounts: [process.env.MAINNET_PRIVATE_KEY],
  chainId: 42161,
},
optimism: {
  url: "https://mainnet.optimism.io",
  accounts: [process.env.MAINNET_PRIVATE_KEY],
  chainId: 10,
},
```

---

## Part 2: Frontend Deployment to Web3

### Option A: IPFS + Fleek (Fully Decentralized)

**Advantages:**
- Censorship-resistant
- Decentralized hosting
- Free (with limits)
- Automatic IPFS pinning

#### Step 1: Sign up for Fleek

1. Go to https://fleek.co/
2. Sign up with GitHub
3. Connect your repository

#### Step 2: Configure Fleek

1. **Build Command:** `cd frontend && npm install && npm run build`
2. **Publish Directory:** `frontend/dist`
3. **Build Environment:**
   ```
   VITE_CHAIN_ID=1
   VITE_LENDING_POOL_ADDRESS=0xYOUR_MAINNET_ADDRESS
   VITE_CREDIT_SCORE_ADDRESS=0x...
   VITE_KYC_REGISTRY_ADDRESS=0x...
   VITE_PLATFORM_TOKEN_ADDRESS=0x...
   VITE_GOVERNANCE_ADDRESS=0x...
   VITE_API_URL=https://your-backend-api.com
   ```

#### Step 3: Deploy

- Fleek will auto-deploy on every Git push
- You get:
  - IPFS hash: `ipfs://Qm...`
  - Fleek URL: `https://your-site.on.fleek.co`
  - ENS domain (optional): `your-site.eth`

#### Step 4: Setup ENS Domain

1. Buy ENS name at https://app.ens.domains/
2. Point it to your IPFS hash
3. Users can access via `yourapp.eth`

---

### Option B: Vercel (Fast & Easy)

**Advantages:**
- Fast global CDN
- Easy deployment
- Free tier available
- Custom domains

#### Step 1: Prepare Frontend

Update `frontend/.env.production`:

```bash
VITE_CHAIN_ID=1
VITE_API_URL=https://api.yourapp.com
VITE_LENDING_POOL_ADDRESS=0xMAINNET_ADDRESS
VITE_CREDIT_SCORE_ADDRESS=0x...
VITE_KYC_REGISTRY_ADDRESS=0x...
VITE_PLATFORM_TOKEN_ADDRESS=0x...
VITE_GOVERNANCE_ADDRESS=0x...
```

#### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend folder
cd frontend
vercel --prod
```

Or connect via GitHub:
1. Go to https://vercel.com/
2. Import your GitHub repo
3. Set build settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variables
5. Deploy!

You get: `https://yourapp.vercel.app`

#### Step 3: Custom Domain

1. Buy domain (Namecheap, GoDaddy)
2. In Vercel dashboard: Settings → Domains
3. Add your domain
4. Update DNS records

---

### Option C: IPFS + Pinata

**For manual IPFS hosting:**

```bash
# Build frontend
cd frontend
npm run build

# Upload to Pinata
# 1. Go to https://pinata.cloud/
# 2. Upload the 'dist' folder
# 3. Pin it
# 4. Get IPFS hash

# Access via:
# https://gateway.pinata.cloud/ipfs/YOUR_HASH
# ipfs://YOUR_HASH
```

---

## Part 3: Backend Deployment

### Option A: AWS (Scalable)

#### Deploy to AWS Elastic Beanstalk:

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init

# Create environment
eb create production-env

# Deploy
eb deploy

# Set environment variables
eb setenv RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY \
  LENDING_POOL_ADDRESS=0x... \
  CHAIN_ID=1

# Get URL
eb open
```

**Cost:** ~$20-50/month

---

### Option B: Heroku (Easy)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd backend
heroku create your-p2p-lending-api

# Set environment variables
heroku config:set RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
heroku config:set LENDING_POOL_ADDRESS=0x...
heroku config:set CHAIN_ID=1
heroku config:set JWT_SECRET=your_production_secret

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

You get: `https://your-p2p-lending-api.herokuapp.com`

**Cost:** Free tier available, then $7+/month

---

### Option C: DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/
2. Create new App
3. Connect GitHub repo
4. Select backend folder
5. Add environment variables
6. Deploy

**Cost:** $5-12/month

---

### Option D: Railway (Modern)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
cd backend
railway init

# Deploy
railway up

# Set environment variables in dashboard
railway open
```

**Cost:** $5+/month

---

## Part 4: Domain & DNS Setup

### Option A: Traditional Domain

1. **Buy Domain:**
   - Namecheap: https://www.namecheap.com/
   - GoDaddy: https://www.godaddy.com/
   - Google Domains: https://domains.google/

2. **Point to Frontend:**
   - Add A record: `@` → Vercel IP
   - Add CNAME: `www` → `yourapp.vercel.app`

3. **Point API:**
   - Add CNAME: `api` → `your-backend.herokuapp.com`

**Result:**
- Frontend: `https://yourapp.com`
- API: `https://api.yourapp.com`

---

### Option B: ENS Domain (Web3 Native)

1. **Buy ENS:**
   - Go to https://app.ens.domains/
   - Search for name: `yourapp.eth`
   - Register (costs ~$5-20/year in ETH)

2. **Point to IPFS:**
   - In ENS dashboard
   - Set Content Hash → IPFS hash
   - Users access via `yourapp.eth` in Brave/Opera
   - Or via `yourapp.eth.limo` or `yourapp.eth.link`

---

## Part 5: Complete Deployment Checklist

### Pre-Launch (1-2 Months)

- [ ] Smart contract audit completed
- [ ] All tests passing (unit + integration)
- [ ] Testnet deployed and tested for 2+ weeks
- [ ] Bug bounty program launched
- [ ] Legal review completed
- [ ] Terms of Service written
- [ ] Privacy Policy written
- [ ] Insurance arranged
- [ ] Multisig setup (3-of-5 or 4-of-7)
- [ ] Emergency procedures documented
- [ ] Monitoring/alerts configured

### Launch Day

- [ ] Deploy contracts to mainnet
- [ ] Verify all contracts on Etherscan
- [ ] Transfer ownership to multisig
- [ ] Deploy frontend to hosting
- [ ] Deploy backend to cloud
- [ ] Setup custom domain
- [ ] Configure SSL certificates
- [ ] Test all features on mainnet
- [ ] Announce launch
- [ ] Monitor closely

### Post-Launch (First Week)

- [ ] Monitor transactions 24/7
- [ ] Check for bugs/exploits
- [ ] Gather user feedback
- [ ] Fix critical issues immediately
- [ ] Communicate with community
- [ ] Track TVL (Total Value Locked)
- [ ] Monitor gas costs
- [ ] Analyze user behavior

---

## Part 6: Monitoring & Maintenance

### Smart Contract Monitoring

**Use:**
- Tenderly: https://tenderly.co/
- Defender: https://www.openzeppelin.com/defender
- Forta: https://forta.org/

**Setup Alerts for:**
- Large deposits/withdrawals
- Failed transactions
- Unusual patterns
- Admin function calls
- Contract pauses

### Backend Monitoring

**Use:**
- Sentry: https://sentry.io/
- DataDog: https://www.datadoghq.com/
- New Relic: https://newrelic.com/

**Monitor:**
- API response times
- Error rates
- Server health
- Database performance

### Frontend Analytics

**Use:**
- Google Analytics
- Mixpanel: https://mixpanel.com/
- Plausible (privacy-focused): https://plausible.io/

**Track:**
- User sessions
- Page views
- Wallet connections
- Transaction flows
- Bounce rates

---

## Part 7: Cost Breakdown

### One-Time Costs

| Item | Cost |
|------|------|
| Smart Contract Audit | $15,000 - $50,000 |
| Legal Review | $5,000 - $15,000 |
| ENS Domain (.eth) | $5 - $50/year |
| Traditional Domain | $10 - $50/year |
| Contract Deployment (Ethereum) | ~$500 - $1,000 |
| Contract Deployment (Polygon) | ~$5 - $20 |
| **Total Initial** | **$20,000 - $66,000** |

### Monthly Costs

| Service | Cost |
|---------|------|
| Frontend Hosting (Vercel/Fleek) | $0 - $20 |
| Backend Hosting (Heroku/AWS) | $20 - $100 |
| Database (if needed) | $15 - $50 |
| Monitoring Tools | $50 - $200 |
| Insurance | $500 - $2,000 |
| **Total Monthly** | **$585 - $2,370** |

**Cheaper Alternative (Testnet/Polygon):**
- Skip audit for MVP: Save $15k-50k
- Use Polygon: Save $500 gas
- Use free tiers: $0-50/month

---

## Part 8: Quick Deploy Commands

### Deploy Everything to Mainnet:

```bash
# 1. Deploy contracts to Ethereum
npx hardhat run scripts/deploy.js --network mainnet

# 2. Verify contracts
node scripts/verify-all.js mainnet

# 3. Initialize (be careful!)
npx hardhat run scripts/initialize-mainnet.js --network mainnet

# 4. Deploy frontend to Vercel
cd frontend
vercel --prod

# 5. Deploy backend to Heroku
cd backend
git push heroku main

# 6. Test everything
curl https://api.yourapp.com/api/health
```

---

## Part 9: Security Best Practices

### Smart Contracts

1. **Use Multisig** (Gnosis Safe)
2. **Time Locks** on critical functions
3. **Rate Limits** on withdrawals
4. **Emergency Pause** mechanism
5. **Upgrade Path** via proxy pattern
6. **Bug Bounty** on Immunefi

### Backend

1. **API Rate Limiting**
2. **CORS** properly configured
3. **Input Validation** on all endpoints
4. **Secrets** in environment variables
5. **HTTPS Only**
6. **Regular Updates** for dependencies

### Frontend

1. **CSP Headers** configured
2. **No Private Keys** in code
3. **Wallet Security** warnings
4. **Transaction Confirmation** dialogs
5. **Phishing Protection** education

---

## Part 10: Going Live Checklist

### Week Before Launch

- [ ] Final security audit review
- [ ] All contracts deployed to mainnet
- [ ] All contracts verified on Etherscan
- [ ] Multisig configured with signers
- [ ] Frontend deployed and tested
- [ ] Backend deployed and monitored
- [ ] Domain configured with SSL
- [ ] Documentation complete
- [ ] Support system ready
- [ ] Marketing materials prepared

### Launch Day

- [ ] Announce on Twitter/Discord
- [ ] Post on Reddit/forums
- [ ] Monitor all systems
- [ ] Be ready for emergency response
- [ ] Engage with community
- [ ] Track initial metrics

### First Week

- [ ] Daily monitoring
- [ ] Quick bug fixes
- [ ] User support
- [ ] Gather feedback
- [ ] Optimize based on usage

---

## 🎉 You're Live!

Congratulations! Your P2P Lending Platform is now on Web3!

**Remember:**
- Security first, always
- Monitor 24/7 initially
- Listen to users
- Iterate quickly
- Build trust gradually

**Need Help?**
- OpenZeppelin Forum: https://forum.openzeppelin.com/
- Ethereum Stack Exchange: https://ethereum.stackexchange.com/
- Web3 Builders Discord: Various communities

---

**Last Updated:** December 14, 2025
