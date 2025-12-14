import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [account, setAccount] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            fetchStats(accounts[0]);
          }
        });
    }
  }, []);

  const fetchStats = async (address) => {
    try {
      const response = await fetch(`http://localhost:3001/api/stats/${address}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!account) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Connect wallet to view profile</p>
      </div>
    );
  }

  const score = stats?.creditScore?.score || 500;
  const percentage = (score / 1000) * 100;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Wallet Information</h2>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-mono text-sm">{account}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">KYC Status</h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            stats?.kyc?.verified ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>{stats?.kyc?.verified ? '✅ Verified' : '❌ Not Verified'}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Credit Score</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-5xl font-bold text-indigo-600">{score}</p>
            <p className="text-gray-600 mt-2">Out of 1000</p>
          </div>
          <div className="w-32 h-32 relative">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#6366f1"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{percentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
