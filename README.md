# P2P Lending Platform - Fully Decentralized dApp

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![IPFS](https://img.shields.io/badge/hosting-IPFS-purple)
![Blockchain](https://img.shields.io/badge/blockchain-Ethereum-lightgrey)

## 🎉 A Complete Serverless P2P Lending Platform

**100% Decentralized | No Backend Servers | Hosted on IPFS**

### ✨ Features

- 💰 **Deposit & Lend** - Deposit assets and earn interest
- 🏦 **Borrow** - Borrow against your collateral (75% LTV)
- 👤 **KYC Registry** - On-chain identity verification
- 🏆 **Credit Scoring** - Reputation-based lending (0-1000)
- 🗳️ **Governance** - DAO voting with platform tokens
- ⚡ **Flash Loans** - Instant loans for arbitrage
- 🌐 **Fully Serverless** - Frontend on IPFS, no backend needed
- 🔒 **Censorship-Resistant** - Cannot be taken down

---

## 🚀 Quick Start

### Option 1: Use the Deployed Version (Easiest)

**Live on IPFS:** Coming soon after your deployment!

**Live on Sepolia Testnet:**
- Network: Sepolia
- All contracts deployed and verified
- Just connect MetaMask and start!

### Option 2: Run Locally (Development)

```bash
# Clone repository
git clone https://github.com/manishyad375375/p2p-lending-platform.git
cd p2p-lending-platform

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Start local blockchain
npx hardhat node

# Deploy contracts (new terminal)
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/initialize-testnet.js --network localhost
npx hardhat run scripts/create-test-pool.js --network localhost

# Start frontend
cd frontend
npm run dev
```

Open http://localhost:3000

---

## 💻 Architecture

### Serverless Stack

```
┌─────────────────────────────────────────────┐
│                                             │
│  Frontend (React + Vite)                     │
│  └──> Hosted on IPFS (Pinata/Fleek)         │
│                                             │
│  Smart Contracts (Solidity)                  │
│  └──> Deployed on Ethereum/Polygon          │
│                                             │
│  Web3 Integration (ethers.js)                │
│  └──> Direct blockchain calls from browser  │
│                                             │
│  NO BACKEND SERVERS! ✅                     │
│                                             │
└─────────────────────────────────────────────┘
```

### Smart Contracts

- **LendingPool.sol** - Core lending/borrowing logic
- **CreditScore.sol** - On-chain credit scoring (0-1000)
- **KYCRegistry.sol** - Identity verification registry
- **PlatformToken.sol** - Governance token (P2PL)
- **Governance.sol** - DAO voting mechanism
- **FlashLoan.sol** - Flash loan provider

### Frontend

- **React** - UI framework
- **Vite** - Build tool
- **ethers.js** - Blockchain interaction
- **TailwindCSS** - Styling
- **React Router** - Navigation

---

## 📦 Deployed Contracts (Sepolia)

```
PlatformToken:    0x39753a2eb235e022903e3D9D01D378f54ada487D
Governance:       0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c
LendingPool:      0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7
CreditScore:      0x4745d42273b6f72d882ef07be3b94f9c38a797e4
KYCRegistry:      0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9
FlashLoan:        0xd88743fb6F9FaEDaD18452B00B1dD18b40d2654A
```

**View on Etherscan:**
https://sepolia.etherscan.io/address/0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7

---

## 🚀 Deploy to IPFS

### Quick Deploy (10 Minutes)

1. **Setup environment:**
   ```bash
   cd frontend
   cp .env.production.example .env.production
   # Edit with your Infura key and contract addresses
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Upload to Pinata:**
   - Go to https://pinata.cloud/
   - Sign up (FREE)
   - Upload `frontend/dist/` folder
   - Get IPFS hash

4. **Access your dApp:**
   ```
   https://gateway.pinata.cloud/ipfs/YOUR_HASH
   ```

**Detailed Guide:** [PINATA_DEPLOYMENT.md](./PINATA_DEPLOYMENT.md)

---

## 📚 Documentation

### Deployment Guides

- **[PINATA_DEPLOYMENT.md](./PINATA_DEPLOYMENT.md)** - Deploy to IPFS via Pinata
- **[IPFS_SERVERLESS_GUIDE.md](./IPFS_SERVERLESS_GUIDE.md)** - Complete serverless architecture
- **[FREE_DEPLOYMENT_GUIDE.md](./FREE_DEPLOYMENT_GUIDE.md)** - Free hosting options
- **[MAINNET_DEPLOYMENT_GUIDE.md](./MAINNET_DEPLOYMENT_GUIDE.md)** - Production deployment
- **[LOCALHOST_SETUP_COMPLETE.md](./LOCALHOST_SETUP_COMPLETE.md)** - Local development setup
- **[COMPLETE_DEPLOYMENT_GUIDE.md](./COMPLETE_DEPLOYMENT_GUIDE.md)** - Everything you need

### User Guides

- **Connect Wallet** - Use MetaMask on Sepolia
- **Deposit Assets** - Lend and earn interest
- **Borrow** - Get loans against collateral
- **Check KYC** - View verification status
- **View Credit Score** - See your reputation (0-1000)
- **Governance** - Vote on proposals

---

## 🔧 Tech Stack

### Blockchain
- Solidity 0.8.20
- Hardhat
- OpenZeppelin Contracts
- ethers.js v6

### Frontend
- React 18
- Vite 5
- TailwindCSS 3
- React Router 6

### Hosting
- IPFS (Pinata/Fleek)
- No backend servers!

### Network
- Ethereum Sepolia (Testnet)
- Polygon (Mainnet ready)
- Localhost (Development)

---

## 💰 Cost Breakdown

| Component | Cost |
|-----------|------|
| **Frontend (IPFS via Pinata)** | **$0/month** |
| **Smart Contracts (Sepolia)** | **$0 (testnet)** |
| **Smart Contracts (Polygon Mainnet)** | ~$10 one-time |
| **RPC Access (Infura/Alchemy)** | **$0 (free tier)** |
| **Domain (optional)** | $10/year |
| **ENS (optional)** | $5-20/year |

**Total: $0-30/year** (vs $300-2400/year for traditional hosting)

---

## ⚙️ Configuration

### Environment Variables

**Frontend (.env.production):**
```bash
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

VITE_LENDING_POOL_ADDRESS=0x...
VITE_CREDIT_SCORE_ADDRESS=0x...
VITE_KYC_REGISTRY_ADDRESS=0x...
VITE_PLATFORM_TOKEN_ADDRESS=0x...
VITE_GOVERNANCE_ADDRESS=0x...
```

### Supported Networks

- **Localhost** (31337) - Development
- **Sepolia** (11155111) - Testnet
- **Polygon** (137) - Mainnet
- **Ethereum** (1) - Mainnet

---

## 🧪 Testing

### Run Tests

```bash
# Compile contracts
npm run compile

# Run tests (when added)
npm test

# Coverage
npm run coverage
```

### Test on Sepolia

1. Get test ETH: https://sepoliafaucet.com/
2. Connect MetaMask to Sepolia
3. Visit deployed dApp
4. Test all features

---

## 👥 Contributing

Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

## 🔗 Links

- **GitHub:** https://github.com/manishyad375375/p2p-lending-platform
- **Live dApp:** Coming soon (IPFS)
- **Sepolia Contracts:** https://sepolia.etherscan.io/

---

## ⚠️ Disclaimer

**FOR EDUCATIONAL PURPOSES ONLY**

This is a demonstration project. Before using with real funds:

1. Get professional security audit
2. Comprehensive testing
3. Legal compliance review
4. Insurance coverage
5. Bug bounty program

**USE AT YOUR OWN RISK**

---

## 📧 Contact

- GitHub: [@manishyad375375](https://github.com/manishyad375375)
- Issues: [GitHub Issues](https://github.com/manishyad375375/p2p-lending-platform/issues)

---

## 🎉 Acknowledgments

- OpenZeppelin for secure contract libraries
- Hardhat for development environment
- ethers.js for Web3 integration
- Pinata for IPFS hosting
- Infura for RPC access

---

## 📈 Roadmap

### Phase 1: MVP (Complete)
- [x] Core lending/borrowing
- [x] KYC registry
- [x] Credit scoring
- [x] Governance
- [x] Frontend
- [x] IPFS deployment

### Phase 2: Enhancement
- [ ] Flash loan UI
- [ ] Interest accrual
- [ ] Liquidations
- [ ] Analytics dashboard
- [ ] The Graph integration

### Phase 3: Production
- [ ] Security audit
- [ ] Mainnet deployment
- [ ] Bug bounty
- [ ] Marketing
- [ ] Community growth

---

**Built with ❤️ using Web3 technologies**

**Star ⭐ this repo if you find it useful!**
