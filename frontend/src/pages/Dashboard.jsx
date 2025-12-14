import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const KYC_ABI = ['function isKycVerified(address) view returns (bool)'];
const SCORE_ABI = ['function getScore(address) view returns (uint256 score, uint256 lastUpdated, uint256 totalLoans, uint256 totalRepaid, bool kycVerified)'];

const Dashboard = () => {
  const [account, setAccount] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const KYC_ADDRESS = import.meta.env.VITE_KYC_REGISTRY_ADDRESS;
  const SCORE_ADDRESS = import.meta.env.VITE_CREDIT_SCORE_ADDRESS;
  const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY';

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            fetchStatsFromBlockchain(accounts[0]);
          }
        });
    }
  }, []);

  const fetchStatsFromBlockchain = async (address) => {
    setLoading(true);
    try {
      const provider = window.ethereum 
        ? new ethers.BrowserProvider(window.ethereum)
        : new ethers.JsonRpcProvider(RPC_URL);

      const kyc = new ethers.Contract(KYC_ADDRESS, KYC_ABI, provider);
      const score = new ethers.Contract(SCORE_ADDRESS, SCORE_ABI, provider);

      const kycVerified = await kyc.isKycVerified(address);
      const scoreData = await score.getScore(address);

      setStats({
        kyc: { verified: kycVerified },
        creditScore: {
          score: scoreData.score.toString(),
          lastUpdated: scoreData.lastUpdated.toString(),
          totalLoans: scoreData.totalLoans.toString(),
          totalRepaid: scoreData.totalRepaid.toString()
        }
      });
    } catch (error) {
      console.error('Error fetching from blockchain:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">Welcome to P2P Lending Platform</h2>
        <p className="text-gray-600 mb-8">Connect your wallet to get started</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="font-bold text-lg mb-2">🎉 Fully Decentralized dApp!</h3>
          <ul className="text-left space-y-2">
            <li>✅ Hosted on IPFS (Decentralized Storage)</li>
            <li>✅ Smart Contracts on Blockchain</li>
            <li>✅ No Backend Servers</li>
            <li>✅ 100% Serverless</li>
            <li>✅ Censorship-Resistant</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading from blockchain...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Deposited</h3>
          <p className="text-3xl font-bold text-green-600">$0.00</p>
          <p className="text-xs text-gray-400 mt-1">In all pools</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Borrowed</h3>
          <p className="text-3xl font-bold text-blue-600">$0.00</p>
          <p className="text-xs text-gray-400 mt-1">Active loans</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Credit Score</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats?.creditScore?.score || '500'}/1000
          </p>
          <p className="text-xs text-gray-400 mt-1">Your rating</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Account Info</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Address:</span>
            <span className="font-mono text-sm">{account}</span>
          </div>
          {stats && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">KYC Status:</span>
                <span className={stats.kyc?.verified ? 'text-green-600' : 'text-red-600'}>
                  {stats.kyc?.verified ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credit Score:</span>
                <span className="font-bold">{stats.creditScore?.score || 0}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-2">🌐 Serverless Architecture</h3>
        <p className="text-sm text-gray-700">This dApp reads data directly from blockchain smart contracts. No centralized servers needed!</p>
      </div>
    </div>
  );
};

export default Dashboard;
