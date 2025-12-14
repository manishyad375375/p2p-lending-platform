import React, { useState } from 'react';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import { parseEther } from 'viem';

const LendingPools = () => {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');

  if (!isConnected) {
    return <div className="text-center py-20">Connect wallet to view pools</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Lending Pools</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Deposit</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="0.0"
            />
          </div>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
            Deposit
          </button>
        </div>

        {/* Borrow Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Borrow</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="0.0"
            />
          </div>
          <p className="text-sm text-gray-600 mb-4">Max LTV: 75%</p>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Borrow
          </button>
        </div>
      </div>

      {/* Pool Stats */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Your Position</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Deposited</p>
            <p className="text-2xl font-bold">0.00 ETH</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Borrowed</p>
            <p className="text-2xl font-bold">0.00 ETH</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LendingPools;
