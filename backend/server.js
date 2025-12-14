const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Initialize blockchain provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

console.log('Blockchain provider initialized');
console.log('Signer address:', signer.address);

// Contract ABIs (simplified)
const LENDING_POOL_ABI = [
  'function deposit(bytes32 poolId, uint256 amount) external',
  'function withdraw(bytes32 poolId, uint256 amount) external',
  'function borrow(bytes32 poolId, uint256 amount) external',
  'function repay(bytes32 poolId, uint256 amount) external',
  'function positions(bytes32 poolId, address user) view returns (uint256 deposited, uint256 borrowed, uint256 debtIndex)',
  'function pools(bytes32 poolId) view returns (address asset, uint256 ltv, uint256 baseRate, uint256 utilRateSlope1, uint256 utilRateSlope2, uint256 kink, bool isActive)'
];

const KYC_REGISTRY_ABI = [
  'function isKycVerified(address user) view returns (bool)',
  'function setKYC(address user, bool verified) external'
];

const CREDIT_SCORE_ABI = [
  'function getScore(address user) view returns (uint256 score, uint256 lastUpdated, uint256 totalLoans, uint256 totalRepaid, bool kycVerified)',
  'function updateScore(address user, uint256 newScore, uint256 totalLoans, uint256 totalRepaid, bool kycVerified) external'
];

// Initialize contracts
const lendingPool = new ethers.Contract(
  process.env.LENDING_POOL_ADDRESS,
  LENDING_POOL_ABI,
  signer
);

const kycRegistry = new ethers.Contract(
  process.env.KYC_REGISTRY_ADDRESS,
  KYC_REGISTRY_ABI,
  signer
);

const creditScore = new ethers.Contract(
  process.env.CREDIT_SCORE_ADDRESS,
  CREDIT_SCORE_ABI,
  signer
);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    network: process.env.CHAIN_ID,
    contracts: {
      lendingPool: process.env.LENDING_POOL_ADDRESS,
      kycRegistry: process.env.KYC_REGISTRY_ADDRESS,
      creditScore: process.env.CREDIT_SCORE_ADDRESS
    }
  });
});

// Get user KYC status
app.get('/api/kyc/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const isVerified = await kycRegistry.isKycVerified(address);
    res.json({ address, isVerified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user credit score
app.get('/api/score/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const scoreData = await creditScore.getScore(address);
    res.json({
      address,
      score: scoreData.score.toString(),
      lastUpdated: scoreData.lastUpdated.toString(),
      totalLoans: scoreData.totalLoans.toString(),
      totalRepaid: scoreData.totalRepaid.toString(),
      kycVerified: scoreData.kycVerified
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user position in pool
app.get('/api/position/:poolId/:address', async (req, res) => {
  try {
    const { poolId, address } = req.params;
    const position = await lendingPool.positions(poolId, address);
    res.json({
      poolId,
      address,
      deposited: position.deposited.toString(),
      borrowed: position.borrowed.toString(),
      debtIndex: position.debtIndex.toString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pool info
app.get('/api/pool/:poolId', async (req, res) => {
  try {
    const { poolId } = req.params;
    const pool = await lendingPool.pools(poolId);
    res.json({
      poolId,
      asset: pool.asset,
      ltv: pool.ltv.toString(),
      baseRate: pool.baseRate.toString(),
      utilRateSlope1: pool.utilRateSlope1.toString(),
      utilRateSlope2: pool.utilRateSlope2.toString(),
      kink: pool.kink.toString(),
      isActive: pool.isActive
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update KYC status (admin only)
app.post('/api/kyc/update', async (req, res) => {
  try {
    const { address, verified } = req.body;
    
    // Verify admin
    const adminAddresses = process.env.ADMIN_ADDRESSES?.split(',') || [];
    if (!adminAddresses.includes(signer.address)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const tx = await kycRegistry.setKYC(address, verified);
    await tx.wait();
    
    res.json({ 
      success: true, 
      tx: tx.hash,
      address,
      verified
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update credit score (admin only)
app.post('/api/score/update', async (req, res) => {
  try {
    const { address, score, totalLoans, totalRepaid, kycVerified } = req.body;
    
    // Verify admin
    const adminAddresses = process.env.ADMIN_ADDRESSES?.split(',') || [];
    if (!adminAddresses.includes(signer.address)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const tx = await creditScore.updateScore(
      address,
      score,
      totalLoans || 0,
      totalRepaid || 0,
      kycVerified
    );
    await tx.wait();
    
    res.json({ 
      success: true, 
      tx: tx.hash,
      address,
      score
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user stats
app.get('/api/stats/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Get KYC status
    const isVerified = await kycRegistry.isKycVerified(address);
    
    // Get credit score
    const scoreData = await creditScore.getScore(address);
    
    res.json({
      address,
      kyc: {
        verified: isVerified
      },
      creditScore: {
        score: scoreData.score.toString(),
        lastUpdated: scoreData.lastUpdated.toString(),
        totalLoans: scoreData.totalLoans.toString(),
        totalRepaid: scoreData.totalRepaid.toString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Network: ${process.env.CHAIN_ID || 'localhost'}`);
});
