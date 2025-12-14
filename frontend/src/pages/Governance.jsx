import React, { useState } from 'react';
import { useAccount } from 'wagmi';

const Governance = () => {
  const { isConnected } = useAccount();
  const [proposals, setProposals] = useState([]);

  if (!isConnected) {
    return <div className="text-center py-20">Connect wallet to participate in governance</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Governance</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Create Proposal</h2>
        <textarea
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
          rows="4"
          placeholder="Describe your proposal..."
        ></textarea>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Submit Proposal
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Active Proposals</h2>
        {proposals.length === 0 ? (
          <p className="text-gray-500">No active proposals</p>
        ) : (
          proposals.map((proposal, idx) => (
            <div key={idx} className="border-b py-4 last:border-b-0">
              <h3 className="font-bold">{proposal.title}</h3>
              <p className="text-gray-600 text-sm">{proposal.description}</p>
              <div className="flex space-x-4 mt-2">
                <button className="text-green-600 hover:underline">Vote For</button>
                <button className="text-red-600 hover:underline">Vote Against</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Governance;
