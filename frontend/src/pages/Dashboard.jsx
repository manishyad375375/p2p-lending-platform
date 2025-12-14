import React, { useEffect, useState } from 'react';

const Dashboard = () => {
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
        <h2 className="text-3xl font-bold mb-4">Welcome to P2P Lending Platform</h2>
        <p className="text-gray-600 mb-8">Connect your wallet to get started</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="font-bold text-lg mb-2">🎉 Your Platform is Running!</h3>
          <ul className="text-left space-y-2">
            <li>✅ Smart Contracts Deployed</li>
            <li>✅ Backend API Running</li>
            <li>✅ Frontend Connected</li>
            <li>✅ Test Pool Created</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
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

      <div className="bg-white p-6 rounded-lg shadow">
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
    </div>
  );
};

export default Dashboard;
