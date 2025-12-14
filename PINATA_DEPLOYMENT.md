# Deploy to IPFS via Pinata - Step by Step

## 🎯 Deploy Your P2P Lending Platform to IPFS in 10 Minutes

**Result:** Fully decentralized dApp hosted on IPFS for FREE!

---

## Step 1: Prepare Your Frontend

### 1.1: Create Production Environment File

```bash
cd frontend
cp .env.production.example .env.production
```

### 1.2: Edit `.env.production` with Your Values

**For Sepolia Testnet:**
```bash
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Your deployed contract addresses
VITE_LENDING_POOL_ADDRESS=0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7
VITE_CREDIT_SCORE_ADDRESS=0x4745d42273b6f72d882ef07be3b94f9c38a797e4
VITE_KYC_REGISTRY_ADDRESS=0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9
VITE_PLATFORM_TOKEN_ADDRESS=0x39753a2eb235e022903e3D9D01D378f54ada487D
VITE_GOVERNANCE_ADDRESS=0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c
```

**Get Free Infura Key:**
1. Go to https://infura.io/
2. Sign up (free)
3. Create project
4. Copy API key
5. Use: `https://sepolia.infura.io/v3/YOUR_KEY`

---

## Step 2: Build Frontend for Production

```bash
cd frontend

# Install dependencies (if not done)
npm install

# Build for production
npm run build
```

**Expected output:**
```
vite v5.x.x building for production...
✓ 150 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-abc123.css     12.34 kB
dist/assets/index-def456.js     234.56 kB
✓ built in 3.45s
```

**Result:** `frontend/dist/` folder created with your dApp!

---

## Step 3: Sign Up for Pinata

1. Go to https://pinata.cloud/
2. Click **"Start Building"**
3. Sign up with email or GitHub
4. **Free Plan Includes:**
   - 1 GB storage
   - Unlimited pins
   - 100 GB bandwidth/month

---

## Step 4: Upload to IPFS

### 4.1: Navigate to Files

1. Click **"Files"** in left sidebar
2. Click **"Upload"** button (top right)
3. Select **"Folder"**

### 4.2: Select Your Build Folder

1. Navigate to `frontend/dist/`
2. Select the entire `dist` folder
3. Click **"Upload"**

### 4.3: Configure Upload

1. **Name:** `p2p-lending-platform`
2. **Description:** (optional)
3. Click **"Upload"**

### 4.4: Wait for Upload

- Small spinner shows progress
- Takes 30-60 seconds
- Shows "Upload Complete" when done

---

## Step 5: Get Your IPFS Hash

1. In **Files** list, find your upload
2. You'll see something like:
   ```
   Name: p2p-lending-platform
   CID: QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Size: 2.5 MB
   ```
3. **Copy the CID** (IPFS hash)

**Example CID:**
```
QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o
```

---

## Step 6: Access Your dApp

### Option 1: Pinata Gateway (Recommended)

```
https://gateway.pinata.cloud/ipfs/YOUR_CID
```

**Example:**
```
https://gateway.pinata.cloud/ipfs/QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o
```

### Option 2: Other IPFS Gateways

```
https://ipfs.io/ipfs/YOUR_CID
https://cloudflare-ipfs.com/ipfs/YOUR_CID
https://dweb.link/ipfs/YOUR_CID
```

### Option 3: Native IPFS (Brave Browser)

```
ipfs://YOUR_CID
```

---

## Step 7: Test Your Deployed dApp

1. **Open** your Pinata gateway URL
2. **Wait** 5-10 seconds for first load (IPFS caching)
3. **Connect Wallet**
   - Click "Connect Wallet"
   - Select MetaMask
   - Switch to Sepolia network
4. **Test Features:**
   - ✅ View Dashboard
   - ✅ Check Profile (KYC & Score)
   - ✅ Try Pools (Deposit/Borrow)
   - ✅ View Governance

---

## Step 8: Pin Your Content (Keep It Online)

**Your upload is automatically pinned by Pinata!**

To check:
1. Go to **"Pins"** in Pinata dashboard
2. You should see your `p2p-lending-platform` listed
3. As long as it's pinned, it stays online

**Free tier:** 1 GB pinned storage

---

## Step 9: Share Your dApp

### Short Link (Optional)

Create a short link:
1. In Pinata dashboard, click on your file
2. Click **"Create Gateway Link"**
3. Get shortened URL

### Share:

**Twitter:**
```
🚀 Just deployed my P2P Lending Platform on IPFS!
100% decentralized, serverless, and censorship-resistant.

Try it: https://gateway.pinata.cloud/ipfs/YOUR_CID

#Web3 #IPFS #DeFi #Ethereum
```

**LinkedIn:**
```
Excited to share my latest project: A fully decentralized P2P 
lending platform deployed on IPFS with smart contracts on Ethereum!

Features:
✅ No backend servers
✅ Hosted on IPFS
✅ Direct blockchain interaction
✅ 100% open source

Check it out: [Your IPFS URL]
```

---

## Step 10: Update Your Deployment

### When You Make Changes:

```bash
# 1. Make changes to code
vim frontend/src/App.jsx

# 2. Rebuild
cd frontend
npm run build

# 3. Upload new dist/ folder to Pinata
# 4. Get new CID
# 5. Unpin old version (optional)
# 6. Share new CID
```

### Version Management:

Name your uploads:
- `p2p-lending-v1.0`
- `p2p-lending-v1.1`
- `p2p-lending-v2.0`

---

## 🎉 Success Checklist

- [ ] Frontend built successfully
- [ ] Uploaded to Pinata
- [ ] IPFS hash obtained
- [ ] Accessible via gateway
- [ ] MetaMask connects
- [ ] Can view profile/KYC
- [ ] Pools page loads
- [ ] Shared with friends

---

## 💡 Pro Tips

### 1. Use Custom Domain

Point your domain to IPFS:
```
CNAME record: gateway.pinata.cloud
TXT record: dnslink=/ipfs/YOUR_CID
```

Result: `https://yourapp.com`

### 2. ENS Domain (Web3 Native)

1. Buy ENS: https://app.ens.domains/
2. Set content hash to IPFS CID
3. Access via: `yourapp.eth`

### 3. Automate with GitHub Actions

```yaml
# .github/workflows/deploy-ipfs.yml
name: Deploy to IPFS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build
        run: cd frontend && npm install && npm run build
      - name: Upload to Pinata
        uses: aquiladev/ipfs-action@v0.3.1
        with:
          path: frontend/dist
          service: pinata
          pinataKey: ${{ secrets.PINATA_API_KEY }}
          pinataSecret: ${{ secrets.PINATA_SECRET }}
```

---

## 📊 Your Architecture

```
┌─────────────────────────────────────────┐
│                                         │
│  User visits: gateway.pinata.cloud      │
│  ├─> IPFS retrieves your React app     │
│  ├─> App loads in browser               │
│  ├─> User connects MetaMask             │
│  └─> App calls smart contracts directly│
│                                         │
└───────────────┬─────────────────────────┘
                │
                ├─────> IPFS Network (Frontend)
                │
                └─────> Ethereum/Polygon (Contracts)
```

**No servers in between! Pure decentralization! 🎉**

---

## 🆘 Troubleshooting

### dApp Not Loading

**Problem:** Gateway shows error or loads slowly

**Solutions:**
1. Wait 30-60 seconds (IPFS caching)
2. Try different gateway
3. Check browser console for errors
4. Clear browser cache

### MetaMask Won't Connect

**Problem:** "Connect Wallet" doesn't work

**Solutions:**
1. Check you're on correct network (Sepolia)
2. Refresh page
3. Check browser console
4. Try incognito mode

### Contracts Not Loading

**Problem:** "Error fetching from blockchain"

**Solutions:**
1. Check RPC_URL in .env.production
2. Verify Infura key is valid
3. Check contract addresses are correct
4. Try different RPC provider (Alchemy)

---

## 💰 Costs

| Item | Cost |
|------|------|
| **Pinata Free Plan** | **$0/month** |
| Custom Domain (optional) | $10/year |
| ENS Domain (optional) | $5-20/year |
| **Total** | **$0-30/year** |

**vs Traditional Hosting:**
- Vercel + Railway: $25-75/month
- AWS: $50-200/month

**Savings: $300-2,400/year! 💰**

---

## 🔗 Your Live URLs

**IPFS Gateway:**
```
https://gateway.pinata.cloud/ipfs/YOUR_CID
```

**Native IPFS:**
```
ipfs://YOUR_CID
```

**Share these with the world! 🌍**

---

## 🎯 Next Steps

1. **Test thoroughly** on different browsers
2. **Deploy contracts to mainnet** (when ready)
3. **Get custom domain** for professional look
4. **List on dApp directories:**
   - https://www.stateofthedapps.com/
   - https://dappradar.com/
   - https://defillama.com/
5. **Share on social media**
6. **Add to portfolio**

---

## 📚 Resources

- **Pinata:** https://pinata.cloud/
- **IPFS:** https://ipfs.tech/
- **ENS:** https://ens.domains/
- **Infura:** https://infura.io/
- **Alchemy:** https://www.alchemy.com/

---

## 🎉 Congratulations!

Your P2P Lending Platform is now:
- ✅ Fully decentralized
- ✅ Hosted on IPFS
- ✅ Serverless (no backend)
- ✅ Censorship-resistant
- ✅ FREE forever
- ✅ Production-ready

**Share your IPFS URL and let the world use your dApp! 🚀**

---

**Last Updated:** December 14, 2025
