# Decentralized P2P Lending Platform

A blockchain-based peer-to-peer lending platform with decentralized identity verification, credit scoring, and automated loan management.

## Features

### Core Functionality
- **Decentralized Lending Pools**: Create and manage lending pools with customizable terms
- **KYC/AML Integration**: On-chain identity verification via Civic and SelfKey
- **Decentralized Credit Scoring**: Analyze wallet history and on-chain reputation
- **Automated Interest & Repayment**: Smart contract-based accrual and flexible terms
- **Flash Loans**: Instant borrowing for arbitrage and liquidations
- **DAO Governance**: Community voting on fees, parameters, and platform upgrades

### Monetization
- 0.5-2% fees on loan origination
- Interest spread collection
- Liquidation fees
- Premium analytics dashboard (subscription)
- Insurance add-ons
- Platform token utility (staking, buybacks)

## Tech Stack

### Blockchain
- **Smart Contracts**: Solidity ^0.8.20
- **Framework**: Hardhat
- **Networks**: Ethereum, Polygon, Arbitrum, Optimism
- **Oracles**: Chainlink for price feeds

### Frontend
- **Framework**: React 18 with TypeScript
- **Web3**: ethers.js, wagmi, RainbowKit
- **UI**: TailwindCSS, shadcn/ui
- **State**: Redux Toolkit, React Query

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL, Redis (caching)
- **APIs**: RESTful + GraphQL
- **Indexing**: The Graph protocol

### Identity & Compliance
- Civic Pass integration
- SelfKey identity verification
- On-chain KYC attestations

## Project Structure

```
p2p-lending-platform/
├── contracts/              # Solidity smart contracts
├── frontend/              # React application
├── backend/               # Node.js API server
├── scripts/               # Deployment and utility scripts
├── test/                  # Smart contract tests
├── subgraph/             # The Graph indexing
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites
- Node.js >= 18.x
- npm or yarn
- MetaMask or compatible Web3 wallet
- Hardhat

### Installation

```bash
# Clone the repository
git clone https://github.com/manishyad375375/p2p-lending-platform.git
cd p2p-lending-platform

# Install dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Environment Setup

Create `.env` files in root, frontend, and backend directories:

**Root `.env`**:
```
PRIVATE_KEY=your_private_key
INFURA_API_KEY=your_infura_key
ETHERSCAN_API_KEY=your_etherscan_key
POLYGONSCAN_API_KEY=your_polygonscan_key
```

**Frontend `.env`**:
```
REACT_APP_INFURA_ID=your_infura_id
REACT_APP_WALLETCONNECT_ID=your_walletconnect_id
REACT_APP_API_URL=http://localhost:3001
```

**Backend `.env`**:
```
DATABASE_URL=postgresql://user:password@localhost:5432/p2p_lending
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
CHAINLINK_NODE_URL=your_chainlink_node
```

### Running Locally

```bash
# Compile smart contracts
npm run compile

# Run tests
npm test

# Deploy to local network
npm run deploy:local

# Start frontend (in frontend directory)
cd frontend
npm start

# Start backend (in backend directory)
cd backend
npm run dev
```

## Development Roadmap

### Phase 1: MVP (Months 1-3)
- [x] Core lending pool contracts
- [x] Basic React UI with wallet connection
- [x] Deposit and borrow functionality
- [ ] Testnet deployment (Sepolia, Mumbai)
- [ ] Initial testing and bug fixes

### Phase 2: Enhanced Features (Months 4-6)
- [ ] KYC/AML integration (Civic, SelfKey)
- [ ] Decentralized credit scoring module
- [ ] Flash loan implementation
- [ ] Advanced UI/UX improvements
- [ ] Smart contract audit (Certik, OpenZeppelin)

### Phase 3: Mainnet Launch (Months 7-9)
- [ ] Mainnet deployment (Ethereum, Polygon)
- [ ] DAO governance implementation
- [ ] Platform token launch
- [ ] Marketing and user acquisition
- [ ] Premium features rollout

### Phase 4: Scaling (Months 10-12)
- [ ] L2 integration (Arbitrum, Optimism)
- [ ] Fiat on-ramp partnerships
- [ ] Mobile app development
- [ ] Cross-chain bridge integration
- [ ] Insurance protocol integration

## Smart Contract Architecture

### Core Contracts
- **LendingPool.sol**: Main lending pool logic
- **LoanManager.sol**: Individual loan management
- **InterestRateModel.sol**: Dynamic interest calculation
- **CreditScore.sol**: On-chain credit scoring
- **FlashLoan.sol**: Flash loan provider
- **Governance.sol**: DAO governance
- **PlatformToken.sol**: ERC20 utility token

### Integration Contracts
- **CivicGateway.sol**: Civic Pass integration
- **SelfKeyVerifier.sol**: SelfKey identity verification
- **ChainlinkOracle.sol**: Price feed integration
- **LiquidationEngine.sol**: Automated liquidations

## Security

- Smart contract audits by Certik and OpenZeppelin
- Multi-sig treasury management
- Time-locked governance proposals
- Emergency pause functionality
- Regular security reviews

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Contact

- GitHub: [@manishyad375375](https://github.com/manishyad375375)
- Documentation: [docs/](./docs/)

## Disclaimer

This platform is for educational and experimental purposes. Always conduct thorough due diligence and consult with legal and financial advisors before using decentralized financial applications.