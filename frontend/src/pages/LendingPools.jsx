import React, { useState } from 'react';

const LendingPools = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [account, setAccount] = useState(null);

  React.useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => setAccount(accounts[0]));
    }
  }, []);

  const handleDeposit = () => {
    alert('Deposit feature coming soon! Contract integration in progress.');
  };

  const handleBorrow = () => {
    alert('Borrow feature coming soon! Contract integration in progress.');
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm">
          <strong>📝 Note:</strong> Mock USDC Address: <code className="bg-white px-2 py-1 rounded">0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e</code>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-green-600">💰 Deposit</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="0.0"
            />
          </div>
          <button 
            onClick={handleDeposit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Deposit
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-600">🏦 Borrow</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="0.0"
            />
          </div>
          <p className="text-sm text-gray-600 mb-4">Max LTV: 75%</p>
          <button 
            onClick={handleBorrow}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Borrow
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Your Position</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Deposited</p>
            <p className="text-2xl font-bold">0.00 USDC</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Borrowed</p>
            <p className="text-2xl font-bold">0.00 USDC</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LendingPools;
