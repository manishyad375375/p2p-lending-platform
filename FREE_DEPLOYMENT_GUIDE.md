# Free Deployment Guide - Vercel + Railway

## 🎉 Deploy Your P2P Lending Platform for FREE!

This guide shows you how to deploy:
- **Frontend** → Vercel (Free forever)
- **Backend** → Railway (Free $5 credit monthly)
- **Smart Contracts** → Already on Sepolia testnet!

**Total Cost: $0** (with limitations)

---

## Part 1: Prepare Your Project

### Step 1: Update Frontend for Production

**Create `frontend/.env.production`:**

```bash
# Using your existing Sepolia deployment
VITE_CHAIN_ID=11155111
VITE_API_URL=https://YOUR_BACKEND_URL.railway.app

VITE_LENDING_POOL_ADDRESS=0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7
VITE_CREDIT_SCORE_ADDRESS=0x4745d42273b6f72d882ef07be3b94f9c38a797e4
VITE_KYC_REGISTRY_ADDRESS=0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9
VITE_PLATFORM_TOKEN_ADDRESS=0x39753a2eb235e022903e3D9D01D378f54ada487D
VITE_GOVERNANCE_ADDRESS=0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c
```

**Note:** We'll update the API_URL after deploying backend.

---

### Step 2: Create Backend Environment Template

**Create `backend/.env.railway`:**

```bash
PORT=3001
NODE_ENV=production

# Sepolia RPC (free Infura/Alchemy)
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=YOUR_BACKEND_WALLET_PRIVATE_KEY
CHAIN_ID=11155111

# Contract Addresses (Sepolia)
LENDING_POOL_ADDRESS=0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7
CREDIT_SCORE_ADDRESS=0x4745d42273b6f72d882ef07be3b94f9c38a797e4
KYC_REGISTRY_ADDRESS=0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9
PLATFORM_TOKEN_ADDRESS=0x39753a2eb235e022903e3D9D01D378f54ada487D
GOVERNANCE_ADDRESS=0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c

# Auth
JWT_SECRET=your_production_secret_key_change_this
JWT_EXPIRES_IN=7d

# Admin
ADMIN_ADDRESSES=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

---

### Step 3: Get Free RPC API Key

**Option A: Infura (Recommended)**

1. Go to https://infura.io/
2. Sign up for free account
3. Create new project
4. Copy API key
5. Your RPC URL: `https://sepolia.infura.io/v3/YOUR_KEY`

**Option B: Alchemy**

1. Go to https://www.alchemy.com/
2. Sign up for free
3. Create app (Ethereum → Sepolia)
4. Copy HTTP URL

**Free Limits:**
- Infura: 100,000 requests/day
- Alchemy: 300M compute units/month

**Enough for thousands of users!**

---

## Part 2: Deploy Backend to Railway

### Step 1: Sign Up for Railway

1. Go to https://railway.app/
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (easiest)
4. You get **$5 free credit/month**

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account
4. Select **`p2p-lending-platform`** repository
5. Railway will detect it's a monorepo

### Step 3: Configure Backend Service

1. **Root Directory:** Set to `backend`
2. **Start Command:** `npm start`
3. **Build Command:** `npm install`

### Step 4: Add Environment Variables

**In Railway Dashboard:**

1. Click on your service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add each variable from `.env.railway`:

```bash
PORT=3001
NODE_ENV=production
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key
CHAIN_ID=11155111
LENDING_POOL_ADDRESS=0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7
CREDIT_SCORE_ADDRESS=0x4745d42273b6f72d882ef07be3b94f9c38a797e4
KYC_REGISTRY_ADDRESS=0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9
PLATFORM_TOKEN_ADDRESS=0x39753a2eb235e022903e3D9D01D378f54ada487D
GOVERNANCE_ADDRESS=0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c
JWT_SECRET=random_secret_key_12345
ADMIN_ADDRESSES=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**⚠️ IMPORTANT:** Use a NEW wallet private key for backend, not your main wallet!

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Railway will build and deploy
4. You'll get a URL like: `https://p2p-lending-backend-production.up.railway.app`

### Step 6: Generate Public Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Copy your URL: `https://your-backend.railway.app`

### Step 7: Test Backend

Open in browser:
```
https://your-backend.railway.app/api/health
```

You should see:
```json
{
  "status": "ok",
  "network": "11155111",
  "contracts": {...}
}
```

**✅ Backend is LIVE!**

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Sign Up for Vercel

1. Go to https://vercel.com/
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Select **`p2p-lending-platform`** from your repos
3. Click **"Import"**

### Step 3: Configure Build Settings

**Framework Preset:** Vite

**Root Directory:** `frontend` (Click "Edit" and select)

**Build Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```bash
VITE_CHAIN_ID=11155111
VITE_API_URL=https://your-backend.railway.app
VITE_LENDING_POOL_ADDRESS=0xE308042ed9eaCeE274250c69Dcc962D6E7Ded4B7
VITE_CREDIT_SCORE_ADDRESS=0x4745d42273b6f72d882ef07be3b94f9c38a797e4
VITE_KYC_REGISTRY_ADDRESS=0xaC8b78B0FA8B29d0aDd52A448F9A46b6b4255CD9
VITE_PLATFORM_TOKEN_ADDRESS=0x39753a2eb235e022903e3D9D01D378f54ada487D
VITE_GOVERNANCE_ADDRESS=0xB7806dB3F4077B2F279D5ddC0F712224673B3c4c
```

**Replace `your-backend.railway.app` with YOUR actual Railway URL!**

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Vercel will build and deploy
4. You'll get: `https://your-project.vercel.app`

### Step 6: Test Frontend

1. Open your Vercel URL
2. You should see your P2P Lending Platform!
3. Click **"Connect Wallet"**
4. Switch MetaMask to **Sepolia** network
5. Test the app!

**✅ Frontend is LIVE!**

---

## Part 4: Enable CORS on Backend

**Important:** Allow frontend to call backend API.

### Update `backend/server.js`:

Find this line:
```javascript
app.use(cors());
```

Replace with:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-project.vercel.app',  // Add your Vercel URL
    /\.vercel\.app$/  // Allow all Vercel preview URLs
  ],
  credentials: true
}));
```

**Then:**
1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Enable CORS for production"
   git push
   ```
2. Railway will auto-deploy the update

---

## Part 5: Connect Custom Domain (Optional)

### For Frontend (Vercel):

1. Buy domain (Namecheap, GoDaddy) - $10/year
2. In Vercel dashboard:
   - Go to **Settings** → **Domains**
   - Click **"Add"**
   - Enter your domain: `yourapp.com`
   - Follow DNS instructions
3. Wait 5-60 minutes for DNS propagation
4. **Result:** `https://yourapp.com`

### For Backend (Railway):

1. In Railway dashboard:
   - Go to **Settings** → **Networking**
   - Click **"Custom Domain"**
   - Enter: `api.yourapp.com`
   - Add CNAME record to your DNS
2. **Result:** `https://api.yourapp.com`

---

## Part 6: Auto-Deploy on Git Push

**Both Vercel and Railway auto-deploy!**

### How it Works:

1. You push code to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Railway** automatically:
   - Detects changes in `backend/`
   - Rebuilds backend
   - Deploys new version
   - Takes ~2 minutes

3. **Vercel** automatically:
   - Detects changes in `frontend/`
   - Rebuilds frontend
   - Deploys new version
   - Takes ~1 minute

**You get CI/CD for free! 🎉**

---

## Part 7: Free Tier Limits

### Railway Free Tier:

- **$5 credit/month** (renews monthly)
- **500 hours/month** execution time (~$5 worth)
- **100 GB egress** bandwidth
- **8 GB RAM** max
- **8 vCPU** max

**Good for:** ~1,000-5,000 users/month

**If you exceed:**
- App will sleep until next month
- Or upgrade to $5/month hobby plan

### Vercel Free Tier:

- **100 GB bandwidth/month**
- **Unlimited** sites
- **Unlimited** requests
- **100** serverless function invocations/day
- **6,000** build minutes/month

**Good for:** 10,000+ page views/month

**If you exceed:**
- Bandwidth throttle
- Upgrade to $20/month Pro plan

---

## Part 8: Monitoring Your Apps

### Railway Monitoring:

1. Dashboard shows:
   - CPU usage
   - Memory usage
   - Request count
   - Error logs
   - Credit usage

2. View logs:
   - Click service → **"Logs"** tab
   - Live tail of all requests

### Vercel Monitoring:

1. Analytics:
   - Page views
   - Top pages
   - User locations
   - Performance metrics

2. Deployment logs:
   - Build output
   - Errors
   - Warnings

---

## Part 9: Quick Commands Reference

### Push Updates:

```bash
# Make changes to code
vim frontend/src/App.jsx

# Commit and push
git add .
git commit -m "Update feature"
git push

# Auto-deploys to Vercel & Railway!
```

### Rollback (if something breaks):

**Railway:**
1. Go to Deployments tab
2. Click previous deployment
3. Click "Redeploy"

**Vercel:**
1. Go to Deployments
2. Find working version
3. Click "⋯" → "Promote to Production"

### View Logs:

**Railway:**
```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs
```

**Vercel:**
```bash
# Install CLI
npm install -g vercel

# View logs
vercel logs
```

---

## Part 10: Troubleshooting

### Backend not responding:

1. Check Railway logs
2. Verify environment variables
3. Test health endpoint: `/api/health`
4. Check if credit ran out

### Frontend shows errors:

1. Check browser console (F12)
2. Verify backend URL in env vars
3. Check CORS settings
4. Redeploy frontend

### "Network Error" in app:

1. Backend might be sleeping (Railway)
2. First request wakes it (15-30 sec)
3. Subsequent requests are fast

### CORS errors:

1. Add your Vercel URL to backend CORS
2. Commit and push
3. Wait for Railway to redeploy

---

## 🎉 Success Checklist

- [ ] Backend deployed on Railway
- [ ] Backend health check working
- [ ] Frontend deployed on Vercel
- [ ] Frontend loads in browser
- [ ] Wallet connects to Sepolia
- [ ] Can view profile/KYC status
- [ ] Backend API calls work
- [ ] CORS configured correctly
- [ ] Auto-deploy on git push working

---

## 📊 Your Live URLs

**Frontend (Vercel):**
```
https://your-project.vercel.app
```

**Backend (Railway):**
```
https://your-backend.railway.app
```

**Contracts (Sepolia):**
- Already deployed!
- View on Etherscan: https://sepolia.etherscan.io/

---

## 🚀 Next Steps

1. **Share your app!**
   - Twitter
   - LinkedIn
   - Reddit
   - Portfolio

2. **Custom Domain** ($10/year)
   - Makes it look professional
   - `yourapp.com` vs `yourapp.vercel.app`

3. **Upgrade when needed:**
   - Railway Hobby: $5/month
   - Vercel Pro: $20/month

4. **Deploy to Polygon Mainnet:**
   - When ready for real users
   - Only ~$10 deployment cost

---

## 💰 Total Cost Breakdown

| Item | Cost |
|------|------|
| Smart Contracts (Sepolia) | $0 (testnet) |
| Backend Hosting (Railway) | $0 (free tier) |
| Frontend Hosting (Vercel) | $0 (free tier) |
| RPC API (Infura/Alchemy) | $0 (free tier) |
| Domain (optional) | $10/year |
| **Total** | **$0-10/year** |

**You can run a full dApp for FREE! 🎉**

---

## 📞 Need Help?

**Railway Support:**
- Discord: https://discord.gg/railway
- Docs: https://docs.railway.app/

**Vercel Support:**
- Discord: https://vercel.com/discord
- Docs: https://vercel.com/docs

**Your Repo:**
- Issues: https://github.com/manishyad375375/p2p-lending-platform/issues

---

**Last Updated:** December 14, 2025

**Good luck with your deployment! 🚀**
