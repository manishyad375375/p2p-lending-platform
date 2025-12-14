import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Contract ABIs
const LENDING_POOL_ABI = [
  'function deposit(bytes32 poolId, uint256 amount) external',
  'function withdraw(bytes32 poolId, uint256 amount) external',
  'function borrow(bytes32 poolId, uint256 amount) external',
  'function repay(bytes32 poolId, uint256 amount) external',
  'function positions(bytes32 poolId, address user) view returns (uint256 deposited, uint256 borrowed, uint256 debtIndex)',
  'function pools(bytes32 poolId) view returns (address asset, uint256 ltv, uint256 baseRate, uint256 utilRateSlope1, uint256 utilRateSlope2, uint256 kink, bool isActive)'
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

const LendingPools = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [account, setAccount] = useState(null);
  const [position, setPosition] = useState({ deposited: '0', borrowed: '0' });
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('TOKEN');
  const [poolExists, setPoolExists] = useState(false);

  // Contract addresses from environment
  const LENDING_POOL_ADDRESS = import.meta.env.VITE_LENDING_POOL_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
  const MOCK_USDC_ADDRESS = import.meta.env.VITE_MOCK_USDC_ADDRESS || '';

  // Calculate poolId same way as contract: keccak256(abi.encodePacked(address(asset)))
  const getPoolId = (assetAddress) => {
    return ethers.solidityPackedKeccak256(['address'], [assetAddress]);
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            if (MOCK_USDC_ADDRESS) {
              setTokenAddress(MOCK_USDC_ADDRESS);
              checkPool(MOCK_USDC_ADDRESS);
              loadPosition(accounts[0], MOCK_USDC_ADDRESS);
              loadBalance(accounts[0], MOCK_USDC_ADDRESS);
              loadTokenInfo(MOCK_USDC_ADDRESS);
            }
          }
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (tokenAddress) {
            loadPosition(accounts[0], tokenAddress);
            loadBalance(accounts[0], tokenAddress);
          }
        }
      });
    }
  }, []);

  const checkPool = async (assetAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const lendingPool = new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, provider);
      
      const poolId = getPoolId(assetAddress);
      const pool = await lendingPool.pools(poolId);
      
      setPoolExists(pool.isActive);
      console.log('Pool exists:', pool.isActive);
    } catch (error) {
      console.error('Error checking pool:', error);
      setPoolExists(false);
    }
  };

  const loadTokenInfo = async (assetAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const token = new ethers.Contract(assetAddress, ERC20_ABI, provider);
      const symbol = await token.symbol();
      setTokenSymbol(symbol);
    } catch (error) {
      console.error('Error loading token info:', error);
    }
  };

  const loadPosition = async (userAddress, assetAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const lendingPool = new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, provider);
      
      const poolId = getPoolId(assetAddress);
      console.log('Pool ID:', poolId);
      
      const pos = await lendingPool.positions(poolId, userAddress);
      
      setPosition({
        deposited: ethers.formatUnits(pos.deposited, 18),
        borrowed: ethers.formatUnits(pos.borrowed, 18)
      });
    } catch (error) {
      console.error('Error loading position:', error);
    }
  };

  const loadBalance = async (userAddress, assetAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const token = new ethers.Contract(assetAddress, ERC20_ABI, provider);
      const bal = await token.balanceOf(userAddress);
      setBalance(ethers.formatUnits(bal, 18));
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handleSetToken = async () => {
    if (!tokenAddress || !ethers.isAddress(tokenAddress)) {
      alert('Please enter a valid token address');
      return;
    }

    await checkPool(tokenAddress);
    await loadPosition(account, tokenAddress);
    await loadBalance(account, tokenAddress);
    await loadTokenInfo(tokenAddress);
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!poolExists) {
      alert('Pool does not exist for this token. Please create a pool first.');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const lendingPool = new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, signer);
      
      const amount = ethers.parseUnits(depositAmount, 18);
      const poolId = getPoolId(tokenAddress);
      
      console.log('Deposit details:');
      console.log('- Amount:', depositAmount);
      console.log('- Pool ID:', poolId);
      console.log('- Token:', tokenAddress);
      console.log('- Lending Pool:', LENDING_POOL_ADDRESS);
      
      // Check allowance
      const allowance = await token.allowance(account, LENDING_POOL_ADDRESS);
      console.log('Current allowance:', ethers.formatUnits(allowance, 18));
      
      if (allowance < amount) {
        console.log('Approving tokens...');
        const approveTx = await token.approve(LENDING_POOL_ADDRESS, amount);
        console.log('Approval tx:', approveTx.hash);
        await approveTx.wait();
        console.log('Tokens approved!');
      }
      
      // Deposit
      console.log('Depositing...');
      const depositTx = await lendingPool.deposit(poolId, amount);
      console.log('Deposit tx:', depositTx.hash);
      await depositTx.wait();
      
      alert('✅ Deposit successful!');
      setDepositAmount('');
      
      // Refresh position and balance
      await loadPosition(account, tokenAddress);
      await loadBalance(account, tokenAddress);
    } catch (error) {
      console.error('Deposit error:', error);
      alert(`❌ Deposit failed: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!poolExists) {
      alert('Pool does not exist for this token.');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const lendingPool = new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, signer);
      
      const amount = ethers.parseUnits(borrowAmount, 18);
      const poolId = getPoolId(tokenAddress);
      
      console.log('Borrowing...');
      const borrowTx = await lendingPool.borrow(poolId, amount);
      console.log('Borrow tx:', borrowTx.hash);
      await borrowTx.wait();
      
      alert('✅ Borrow successful!');
      setBorrowAmount('');
      
      // Refresh position and balance
      await loadPosition(account, tokenAddress);
      await loadBalance(account, tokenAddress);
    } catch (error) {
      console.error('Borrow error:', error);
      alert(`❌ Borrow failed: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async () => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const lendingPool = new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, signer);
      
      const amount = ethers.parseUnits(repayAmount, 18);
      const poolId = getPoolId(tokenAddress);
      
      // Check allowance
      const allowance = await token.allowance(account, LENDING_POOL_ADDRESS);
      
      if (allowance < amount) {
        console.log('Approving tokens...');
        const approveTx = await token.approve(LENDING_POOL_ADDRESS, amount);
        await approveTx.wait();
        console.log('Tokens approved!');
      }
      
      // Repay
      console.log('Repaying...');
      const repayTx = await lendingPool.repay(poolId, amount);
      console.log('Repay tx:', repayTx.hash);
      await repayTx.wait();
      
      alert('✅ Repayment successful!');
      setRepayAmount('');
      
      // Refresh position and balance
      await loadPosition(account, tokenAddress);
      await loadBalance(account, tokenAddress);
    } catch (error) {
      console.error('Repay error:', error);
      alert(`❌ Repay failed: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const maxBorrow = () => {
    const deposited = parseFloat(position.deposited);
    const borrowed = parseFloat(position.borrowed);
    const ltv = 0.75; // 75% LTV
    return Math.max(0, (deposited * ltv) - borrowed).toFixed(2);
  };

  if (!account) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Connect wallet to view pools</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Lending Pools</h1>

      {!MOCK_USDC_ADDRESS && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-lg mb-2">⚠️ Configure Token Address</h3>
          <p className="text-sm mb-4">Enter the token address you want to use for lending/borrowing:</p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="0x... token address"
            />
            <button
              onClick={handleSetToken}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Set Token
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: For localhost, use address from deployments/localhost.json<br/>
            💡 For Sepolia, you need to deploy a test token first
          </p>
        </div>
      )}

      {tokenAddress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm">
            <strong>📝 Token ({tokenSymbol}):</strong> <code className="bg-white px-2 py-1 rounded font-mono text-xs">{tokenAddress}</code>
          </p>
          <p className="text-sm mt-2">
            <strong>💰 Your Balance:</strong> {parseFloat(balance).toFixed(2)} {tokenSymbol}
          </p>
          <p className="text-sm mt-2">
            <strong>🏊 Pool Status:</strong> 
            <span className={poolExists ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
              {poolExists ? '✅ Active' : '❌ Not Created'}
            </span>
          </p>
          {!poolExists && (
            <p className="text-xs text-orange-600 mt-2">
              ⚠️ Pool doesn't exist. Run: <code className="bg-white px-2 py-1 rounded">npx hardhat run scripts/create-test-pool.js --network YOUR_NETWORK</code>
            </p>
          )}
        </div>
      )}

      {tokenAddress && poolExists && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Deposit Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-green-600">💰 Deposit</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Amount ({tokenSymbol})</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="0.0"
                  disabled={loading}
                />
                <button
                  onClick={() => setDepositAmount(balance)}
                  className="text-xs text-indigo-600 hover:underline mt-1"
                >
                  Max: {parseFloat(balance).toFixed(2)}
                </button>
              </div>
              <button 
                onClick={handleDeposit}
                disabled={loading || !depositAmount || parseFloat(depositAmount) <= 0}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Processing...' : 'Deposit'}
              </button>
            </div>

            {/* Borrow Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-blue-600">🏦 Borrow</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Amount ({tokenSymbol})</label>
                <input
                  type="number"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="0.0"
                  disabled={loading}
                />
                <button
                  onClick={() => setBorrowAmount(maxBorrow())}
                  className="text-xs text-indigo-600 hover:underline mt-1"
                >
                  Max: {maxBorrow()} (75% LTV)
                </button>
              </div>
              <button 
                onClick={handleBorrow}
                disabled={loading || !borrowAmount || parseFloat(borrowAmount) <= 0 || parseFloat(position.deposited) === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Processing...' : 'Borrow'}
              </button>
              {parseFloat(position.deposited) === 0 && (
                <p className="text-xs text-gray-500 mt-2">💡 Deposit first to borrow</p>
              )}
            </div>
          </div>

          {/* Repay Card */}
          {parseFloat(position.borrowed) > 0 && (
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-bold mb-4 text-orange-600">💳 Repay Loan</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Amount ({tokenSymbol})</label>
                <input
                  type="number"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="0.0"
                  disabled={loading}
                />
                <button
                  onClick={() => setRepayAmount(position.borrowed)}
                  className="text-xs text-indigo-600 hover:underline mt-1"
                >
                  Max: {parseFloat(position.borrowed).toFixed(2)}
                </button>
              </div>
              <button 
                onClick={handleRepay}
                disabled={loading || !repayAmount || parseFloat(repayAmount) <= 0}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Processing...' : 'Repay'}
              </button>
            </div>
          )}

          {/* Your Position */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Your Position</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Deposited</p>
                <p className="text-2xl font-bold text-green-600">{parseFloat(position.deposited).toFixed(2)} {tokenSymbol}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Borrowed</p>
                <p className="text-2xl font-bold text-blue-600">{parseFloat(position.borrowed).toFixed(2)} {tokenSymbol}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">Health Factor</p>
              <p className="text-lg font-bold">
                {parseFloat(position.borrowed) === 0 ? '∞' : 
                 (parseFloat(position.deposited) * 0.75 / parseFloat(position.borrowed)).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Must stay above 1.0 to avoid liquidation</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LendingPools;
