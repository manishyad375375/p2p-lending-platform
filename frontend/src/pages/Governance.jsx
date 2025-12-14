import React, { useState, useEffect } from 'react';

const Governance = () => {
  const [account, setAccount] = useState(null);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            loadProposals();
          }
        });
    }
  }, []);

  const loadProposals = () => {
    // Mock proposals for now
    setProposals([
      {
        id: 1,
        title: 'Increase LTV to 80%',
        description: 'Proposal to increase the loan-to-value ratio from 75% to 80%',
        forVotes: 1250,
        againstVotes: 350,
        status: 'Active',
        endDate: '2025-12-20'
      },
      {
        id: 2,
        title: 'Add New Asset Pool',
        description: 'Proposal to add USDT as a new lending asset',
        forVotes: 2100,
        againstVotes: 890,
        status: 'Active',
        endDate: '2025-12-18'
      },
      {
        id: 3,
        title: 'Reduce Interest Rate',
        description: 'Lower base interest rate from 2% to 1.5%',
        forVotes: 3200,
        againstVotes: 150,
        status: 'Passed',
        endDate: '2025-12-10'
      }
    ]);
  };

  const handleCreateProposal = () => {
    if (!proposalTitle || !proposalDescription) {
      alert('Please fill in all fields');
      return;
    }
    alert('Create proposal feature coming soon! Contract integration in progress.');
    setProposalTitle('');
    setProposalDescription('');
  };

  const handleVote = (proposalId, support) => {
    alert(`Voting feature coming soon! You voted ${support ? 'FOR' : 'AGAINST'} proposal #${proposalId}`);
  };

  if (!account) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Governance</h2>
        <p className="text-gray-600">Connect wallet to participate in governance</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Governance</h1>

      {/* Create Proposal */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Create New Proposal</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Proposal title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32"
              placeholder="Describe your proposal..."
            />
          </div>
          <button
            onClick={handleCreateProposal}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Create Proposal
          </button>
        </div>
      </div>

      {/* Active Proposals */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Proposals</h2>
        
        {proposals.map((proposal) => {
          const totalVotes = proposal.forVotes + proposal.againstVotes;
          const forPercentage = totalVotes > 0 ? (proposal.forVotes / totalVotes * 100).toFixed(1) : 0;
          const againstPercentage = totalVotes > 0 ? (proposal.againstVotes / totalVotes * 100).toFixed(1) : 0;

          return (
            <div key={proposal.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{proposal.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{proposal.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  proposal.status === 'Active' ? 'bg-green-100 text-green-800' :
                  proposal.status === 'Passed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {proposal.status}
                </span>
              </div>

              {/* Voting Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-green-600 font-medium">For: {forPercentage}%</span>
                  <span className="text-red-600 font-medium">Against: {againstPercentage}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${forPercentage}%` }}
                  />
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${againstPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{proposal.forVotes.toLocaleString()} votes</span>
                  <span>{proposal.againstVotes.toLocaleString()} votes</span>
                </div>
              </div>

              {/* Vote Buttons */}
              {proposal.status === 'Active' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleVote(proposal.id, true)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Vote For
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, false)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Vote Against
                  </button>
                </div>
              )}

              <div className="text-xs text-gray-500 mt-3">
                Ends: {proposal.endDate}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Governance;
