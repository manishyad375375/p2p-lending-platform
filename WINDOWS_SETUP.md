# Windows Setup Guide

Special instructions for running the P2P Lending Platform on Windows.

## Common Windows Issues & Fixes

### Issue 1: Hardhat Compilation Error (UV_HANDLE_CLOSING)

**Error:**
```
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76
```

**Solution 1: Use Node.js LTS Version**

This is a known issue with certain Node.js versions on Windows.

1. Check your Node.js version:
   ```bash
   node --version
   ```

2. If you're on v21+ or an odd version, switch to LTS (v20.x):
   - Download from: https://nodejs.org/ (choose LTS)
   - Or use nvm-windows:
     ```bash
     nvm install 20
     nvm use 20
     ```

3. Clear cache and reinstall:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

**Solution 2: Use WSL (Windows Subsystem for Linux)**

The most reliable way to run Hardhat on Windows:

1. Install WSL2:
   ```powershell
   wsl --install
   ```

2. Restart your computer

3. Open Ubuntu from Start Menu

4. Inside WSL:
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Clone project
   cd ~
   git clone https://github.com/manishyad375375/p2p-lending-platform.git
   cd p2p-lending-platform
   
   # Install and run
   npm install
   npx hardhat compile
   ```

**Solution 3: Use Git Bash or PowerShell with Admin Rights**

1. Right-click Git Bash or PowerShell
2. Select "Run as Administrator"
3. Navigate to project:
   ```bash
   cd C:\Users\manis\Downloads\p2p-lending-platform-main\p2p-lending-platform-main
   ```
4. Try compiling again:
   ```bash
   npx hardhat clean
   npx hardhat compile
   ```

**Solution 4: Disable Antivirus Temporarily**

Sometimes Windows Defender or other antivirus software interferes:

1. Open Windows Security
2. Virus & threat protection
3. Manage settings
4. Turn off "Real-time protection" temporarily
5. Try compiling again
6. Re-enable protection after

### Issue 2: Path Issues on Windows

**Error:** File paths with backslashes causing issues

**Solution:** Use forward slashes or escape backslashes:
```bash
# Instead of:
cd C:\Users\manis\Downloads

# Use:
cd C:/Users/manis/Downloads
```

### Issue 3: "npx hardhat node" Port Issues

**Error:** Port 8545 already in use

**Solution:**
```bash
# Find process using port 8545
netstat -ano | findstr :8545

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use a different port
npx hardhat node --port 8546
```

### Issue 4: MetaMask Connection Issues

**Problem:** MetaMask not connecting to localhost

**Solution:**
1. Use `127.0.0.1` instead of `localhost`:
   - RPC URL: `http://127.0.0.1:8545`

2. Check Windows Firewall:
   - Control Panel → Windows Defender Firewall
   - Advanced settings → Inbound Rules
   - Allow Node.js through firewall

### Issue 5: npm Install Fails

**Error:** EACCES or permission errors

**Solution 1: Run as Administrator**
```powershell
# Right-click PowerShell → Run as Administrator
cd C:\Users\manis\Downloads\p2p-lending-platform-main\p2p-lending-platform-main
npm install
```

**Solution 2: Fix npm Permissions**
```bash
npm config set prefix "C:\Users\manis\AppData\Roaming\npm"
```

## Recommended Windows Setup

### Option A: Native Windows (Easier but may have issues)

1. Install Node.js LTS (v20.x): https://nodejs.org/
2. Install Git: https://git-scm.com/
3. Use Git Bash or PowerShell (as Admin)
4. Follow main deployment guide

### Option B: WSL2 (Recommended - Most Stable)

1. Enable WSL2:
   ```powershell
   wsl --install
   ```

2. Install Ubuntu from Microsoft Store

3. Inside Ubuntu terminal:
   ```bash
   # Update packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install Git
   sudo apt install git -y
   
   # Verify installations
   node --version
   npm --version
   git --version
   ```

4. Clone and setup:
   ```bash
   cd ~
   git clone https://github.com/manishyad375375/p2p-lending-platform.git
   cd p2p-lending-platform
   npm install
   ```

5. Everything else works the same as Linux!

## Step-by-Step Windows Deployment

### Prerequisites

**Required:**
- ✅ Node.js v20.x LTS
- ✅ npm (comes with Node.js)
- ✅ Git
- ✅ MetaMask browser extension

**Optional but Recommended:**
- ✅ WSL2 with Ubuntu
- ✅ Git Bash
- ✅ Visual Studio Code with WSL extension

### Step 1: Download Project

**Option A: Using Git**
```bash
git clone https://github.com/manishyad375375/p2p-lending-platform.git
cd p2p-lending-platform
```

**Option B: Download ZIP**
1. Go to https://github.com/manishyad375375/p2p-lending-platform
2. Click "Code" → "Download ZIP"
3. Extract to `C:\Users\manis\Documents\p2p-lending-platform`
4. Open PowerShell/Git Bash and navigate:
   ```bash
   cd C:/Users/manis/Documents/p2p-lending-platform
   ```

### Step 2: Install Dependencies

```bash
# Root dependencies
npm install

# If you get errors, try:
npm install --legacy-peer-deps
```

### Step 3: Compile Contracts

```bash
npx hardhat clean
npx hardhat compile
```

**If you still get the UV_HANDLE_CLOSING error:**

1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   npx hardhat compile
   ```

2. Or switch to WSL2 (recommended)

### Step 4: Start Hardhat Node

**Open NEW PowerShell/Git Bash window:**

```bash
cd C:/Users/manis/Documents/p2p-lending-platform
npx hardhat node
```

Keep this running!

**Troubleshooting:** If port 8545 is busy:
```bash
# Option 1: Kill existing process
netstat -ano | findstr :8545
taskkill /PID <PID> /F

# Option 2: Use different port
npx hardhat node --port 8546
# Then update all configs to use 8546 instead of 8545
```

### Step 5: Deploy Contracts

**Open ANOTHER PowerShell/Git Bash window:**

```bash
cd C:/Users/manis/Documents/p2p-lending-platform
npx hardhat run scripts/deploy.js --network localhost
```

Copy the contract addresses!

### Step 6: Initialize

```bash
npx hardhat run scripts/initialize-testnet.js --network localhost
npx hardhat run scripts/create-test-pool.js --network localhost
```

### Step 7: Setup MetaMask

**Add Network:**
- Network Name: `Localhost 8545`
- RPC URL: `http://127.0.0.1:8545` (use 127.0.0.1, not localhost)
- Chain ID: `31337`
- Currency Symbol: `ETH`

**Import Account:**
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

### Step 8: Setup Frontend

```bash
cd frontend

# Create .env file (use Git Bash or create manually)
echo "VITE_WALLETCONNECT_PROJECT_ID=demo-project-id" > .env
echo "VITE_API_URL=http://localhost:3001" >> .env
echo "VITE_CHAIN_ID=31337" >> .env
echo "VITE_LENDING_POOL_ADDRESS=YOUR_ADDRESS_FROM_STEP_5" >> .env
echo "VITE_CREDIT_SCORE_ADDRESS=YOUR_ADDRESS_FROM_STEP_5" >> .env
echo "VITE_KYC_REGISTRY_ADDRESS=YOUR_ADDRESS_FROM_STEP_5" >> .env
echo "VITE_PLATFORM_TOKEN_ADDRESS=YOUR_ADDRESS_FROM_STEP_5" >> .env
echo "VITE_GOVERNANCE_ADDRESS=YOUR_ADDRESS_FROM_STEP_5" >> .env

npm install
npm run dev
```

**Or create .env manually:**
1. Open Notepad
2. Copy the env content
3. Save as `.env` in `frontend` folder (not `.env.txt`!)

### Step 9: Test!

Open http://localhost:3000 in your browser.

## Windows-Specific Tips

### Using PowerShell

```powershell
# Check Node version
node --version

# List files
ls

# Change directory
cd C:\Users\manis\Documents\p2p-lending-platform

# Clear screen
cls
```

### Using Git Bash (Recommended)

```bash
# More Linux-like commands
cd /c/Users/manis/Documents/p2p-lending-platform
ls
pwd
clear
```

### Using Windows Terminal (Best)

1. Install from Microsoft Store
2. Supports multiple tabs
3. Can run PowerShell, Git Bash, WSL side-by-side

## Quick Reference

### Terminal Windows Needed

| Window | Command | Keep Running? |
|--------|---------|---------------|
| 1 | `npx hardhat node` | ✅ Yes |
| 2 | `cd frontend && npm run dev` | ✅ Yes |
| 3 | `cd backend && npm run dev` | ✅ Yes (optional) |

### Common Commands

```bash
# Check balance
npx hardhat run scripts/check-balance.js --network localhost

# Mint tokens
npx hardhat run scripts/mint-tokens.js --network localhost

# Check position
npx hardhat run scripts/check-position.js --network localhost

# Check score
npx hardhat run scripts/check-score.js --network localhost

# Reset blockchain (restart hardhat node)
Ctrl+C (in hardhat node terminal)
npx hardhat node
```

## Troubleshooting Checklist

- [ ] Using Node.js LTS (v20.x)?
- [ ] Running PowerShell/Git Bash as Administrator?
- [ ] Antivirus disabled temporarily?
- [ ] Port 8545 not in use by other process?
- [ ] Using `127.0.0.1` instead of `localhost`?
- [ ] All node_modules installed (`npm install` in root, frontend, backend)?
- [ ] Contract addresses correct in .env files?
- [ ] MetaMask on Localhost network?
- [ ] Imported test account in MetaMask?

## Still Having Issues?

### Nuclear Option: Complete Reset

```bash
# Stop all terminals

# Delete everything and start fresh
cd C:/Users/manis/Documents/p2p-lending-platform
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf artifacts cache deployments

# Reinstall
npm cache clean --force
npm install
npx hardhat compile

# Try again from Step 4
```

### Best Solution: Use WSL2

If you keep having issues on native Windows, WSL2 is the most reliable:

```powershell
# Install WSL2 (run in PowerShell as Admin)
wsl --install
```

Restart computer, then use Ubuntu terminal for everything.

## Success!

If you see:
- ✅ Hardhat compiles without errors
- ✅ Contracts deployed
- ✅ Frontend running at http://localhost:3000
- ✅ Can connect MetaMask

**You're good to go! 🎉**

## Resources

- WSL2 Setup: https://learn.microsoft.com/en-us/windows/wsl/install
- Node.js Downloads: https://nodejs.org/
- Git for Windows: https://git-scm.com/
- Windows Terminal: https://aka.ms/terminal
