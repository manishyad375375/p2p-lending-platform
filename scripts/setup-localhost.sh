#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== P2P Lending Platform - Localhost Setup ===${NC}\n"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js installed: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm installed: $(npm --version)${NC}\n"

# Install root dependencies
echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install root dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Root dependencies installed${NC}\n"

# Compile contracts
echo -e "${YELLOW}🔨 Compiling smart contracts...${NC}"
npx hardhat compile
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to compile contracts${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Contracts compiled${NC}\n"

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✓ Frontend dependencies installed${NC}\n"

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}\n"

echo -e "${GREEN}=== Setup Complete! ===${NC}\n"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Start Hardhat node: ${GREEN}npx hardhat node${NC}"
echo -e "2. Deploy contracts: ${GREEN}npx hardhat run scripts/deploy.js --network localhost${NC}"
echo -e "3. Initialize data: ${GREEN}npx hardhat run scripts/initialize-testnet.js --network localhost${NC}"
echo -e "4. Create test pool: ${GREEN}npx hardhat run scripts/create-test-pool.js --network localhost${NC}"
echo -e "5. Configure frontend .env with deployed addresses"
echo -e "6. Start frontend: ${GREEN}cd frontend && npm run dev${NC}"
echo -e "7. Start backend: ${GREEN}cd backend && npm run dev${NC}"
echo -e "\n${YELLOW}For detailed instructions, see LOCALHOST_DEPLOYMENT.md${NC}\n"
