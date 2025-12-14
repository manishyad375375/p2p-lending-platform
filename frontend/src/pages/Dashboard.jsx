import React from 'react';
import { useAccount } from 'wagmi';

const Dashboard = () => {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">Welcome to P2P Lending Platform</h2>
        <p className="text-gray-600 mb-8">Connect your wallet to get started</p>
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
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Borrowed</h3>
          <p className="text-3xl font-bold text-blue-600">$0.00</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Net APY</h3>
          <p className="text-3xl font-bold text-purple-600">0%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity</p>
      </div>
    </div>
  );
};

export default Dashboard;
