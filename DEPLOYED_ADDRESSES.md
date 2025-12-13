# Deployed Contract Addresses

## Sepolia Testnet Deployment

**Deployment Date:** December 13, 2025

### Contract Addresses

| Contract | Address | Etherscan |
|----------|---------|----------|
| PlatformToken | `0x39753a2eb235e022903e3D9D01D378f54ada487D` | [View](https://sepolia.etherscan.io/address/0x39753a2eb235e022903e3D9D01D378f54ada487D) |
| Governance | `0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c` | [View](https://sepolia.etherscan.io/address/0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c) |
| LendingPool | `0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7` | [View](https://sepolia.etherscan.io/address/0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7) |
| CreditScore | `0x4745d42273b6f72d882ef07be3b94f9c38a797e4` | [View](https://sepolia.etherscan.io/address/0x4745d42273b6f72d882ef07be3b94f9c38a797e4) |
| KYCRegistry | `0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9` | [View](https://sepolia.etherscan.io/address/0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9) |
| FlashLoan | `0xd88743fb6F9FaEDaD18452B00B1dD18b40d2654A` | [View](https://sepolia.etherscan.io/address/0xd88743fb6F9FaEDaD18452B00B1dD18b40d2654A) |

### Network Details

- **Network:** Sepolia Testnet
- **Chain ID:** 11155111
- **RPC URL:** https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- **Explorer:** https://sepolia.etherscan.io/

## Next Steps

### 1. Verify Contracts on Etherscan

```bash
# Verify PlatformToken
npx hardhat verify --network sepolia 0x39753a2eb235e022903e3D9D01D378f54ada487D

# Verify Governance (with constructor args)
npx hardhat verify --network sepolia 0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c 0x39753a2eb235e022903e3D9D01D378f54ada487D

# Verify LendingPool (with constructor args)
npx hardhat verify --network sepolia 0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7 0x39753a2eb235e022903e3D9D01D378f54ada487D

# Verify CreditScore
npx hardhat verify --network sepolia 0x4745d42273b6f72d882ef07be3b94f9c38a797e4

# Verify KYCRegistry
npx hardhat verify --network sepolia 0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9

# Verify FlashLoan (with constructor args)
npx hardhat verify --network sepolia 0xd88743fb6F9FaEDaD18452B00B1dD18b40d2654A 0x39753a2eb235e022903e3D9D01D378f54ada487D
```

Or verify all at once:
```bash
node scripts/verify-all.js sepolia
```

### 2. Initialize Your Account

Set up KYC and credit score for testing:

```bash
npx hardhat run scripts/initialize-testnet.js --network sepolia
```

This will:
- ✅ Mark your address as KYC verified
- ✅ Initialize your credit score to 500/1000
- ✅ Grant necessary permissions

### 3. Create Test Pool

Create a lending pool with mock USDC:

```bash
npx hardhat run scripts/create-test-pool.js --network sepolia
```

This will:
- Deploy a mock USDC token
- Create a lending pool with 75% LTV
- Set up interest rate model

**Save the Mock USDC address** - you'll need it for the frontend!

### 4. Configure Frontend

Create `frontend/.env`:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_API_URL=http://localhost:3001
VITE_CHAIN_ID=11155111

# Deployed Contract Addresses
VITE_LENDING_POOL_ADDRESS=0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7
VITE_CREDIT_SCORE_ADDRESS=0x4745d42273b6f72d882ef07be3b94f9c38a797e4
VITE_KYC_REGISTRY_ADDRESS=0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9
VITE_PLATFORM_TOKEN_ADDRESS=0x39753a2eb235e022903e3D9D01D378f54ada487D
VITE_GOVERNANCE_ADDRESS=0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c
```

### 5. Configure Backend (Optional)

Create `backend/.env`:

```bash
PORT=3001
NODE_ENV=development

# Sepolia Testnet
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_backend_signer_private_key
CHAIN_ID=11155111

# Deployed Contract Addresses
LENDING_POOL_ADDRESS=0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7
CREDIT_SCORE_ADDRESS=0x4745d42273b6f72d882ef07be3b94f9c38a797e4
KYC_REGISTRY_ADDRESS=0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9
PLATFORM_TOKEN_ADDRESS=0x39753a2eb235e022903e3D9D01D378f54ada487D
GOVERNANCE_ADDRESS=0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c

JWT_SECRET=your_random_secret_key
ADMIN_ADDRESSES=your_wallet_address
```

### 6. Setup MetaMask

**Add Sepolia Network:**
- Network Name: `Sepolia`
- RPC URL: `https://sepolia.infura.io/v3/YOUR_KEY` or `https://rpc.sepolia.org`
- Chain ID: `11155111`
- Currency Symbol: `ETH`
- Block Explorer: `https://sepolia.etherscan.io`

**Get Test ETH:**
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucet.quicknode.com/ethereum/sepolia

### 7. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### 8. Start Backend (Optional)

```bash
cd backend
npm install
npm run dev
```

Backend runs on http://localhost:3001

## Testing the Platform

### Get Mock USDC

```bash
npx hardhat run scripts/mint-tokens.js --network sepolia
```

### Check Your Status

```bash
# Check KYC status
npx hardhat run scripts/check-kyc.js --network sepolia

# Check credit score
npx hardhat run scripts/check-score.js --network sepolia

# Check positions
npx hardhat run scripts/check-position.js --network sepolia
```

### In the Frontend

1. ✅ Connect your MetaMask wallet
2. ✅ Switch to Sepolia network
3. ✅ Check your profile (should show KYC verified)
4. ✅ Go to Pools page
5. ✅ Deposit test USDC
6. ✅ Borrow against your deposit
7. ✅ Repay your loan
8. ✅ Check updated credit score

## Smart Contract Interactions

You can interact with the contracts directly on Etherscan:

### Deposit to Pool

1. Go to [LendingPool on Etherscan](https://sepolia.etherscan.io/address/0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7#writeContract)
2. Connect your wallet
3. Call `deposit` function with poolId and amount

### Borrow from Pool

1. Call `borrow` function with poolId and amount
2. Make sure you have enough collateral (LTV limit)

### Check Your Credit Score

1. Go to [CreditScore on Etherscan](https://sepolia.etherscan.io/address/0x4745d42273b6f72d882ef07be3b94f9c38a797e4#readContract)
2. Call `getScore` with your address

## Troubleshooting

### Transactions Failing?

- ✅ Make sure you have enough Sepolia ETH for gas
- ✅ Check you're on Sepolia network in MetaMask
- ✅ Verify contract addresses are correct
- ✅ Check you have approved token spending

### Frontend Not Connecting?

- ✅ Verify contract addresses in `frontend/.env`
- ✅ Check MetaMask is on Sepolia
- ✅ Clear browser cache
- ✅ Check console for errors (F12)

### KYC Not Verified?

```bash
# Run initialization again
npx hardhat run scripts/initialize-testnet.js --network sepolia
```

## Production Deployment Checklist

Before deploying to mainnet:

- [ ] Complete smart contract audit
- [ ] Add comprehensive unit tests
- [ ] Add integration tests
- [ ] Test all edge cases on testnet
- [ ] Set up monitoring and alerts
- [ ] Prepare incident response plan
- [ ] Get legal review
- [ ] Set up multisig for admin functions
- [ ] Prepare documentation
- [ ] Set up bug bounty program

## Resources

- **Sepolia Faucets:** https://faucetlink.to/sepolia
- **Sepolia Explorer:** https://sepolia.etherscan.io/
- **Hardhat Docs:** https://hardhat.org/
- **OpenZeppelin:** https://docs.openzeppelin.com/

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Review deployment logs
3. Verify all environment variables
4. Check Sepolia block explorer for transaction details
5. Open an issue on GitHub

---

**Deployment Status:** ✅ Live on Sepolia Testnet

**Last Updated:** December 13, 2025
