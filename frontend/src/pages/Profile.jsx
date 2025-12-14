import React, { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';

const Profile = () => {
  const { address, isConnected } = useAccount();
  const [kycStatus, setKycStatus] = useState(false);
  const [creditScore, setCreditScore] = useState(0);

  if (!isConnected) {
    return <div className="text-center py-20">Connect wallet to view profile</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Wallet Information</h2>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-mono">{address}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">KYC Status</h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${kycStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{kycStatus ? 'Verified' : 'Not Verified'}</span>
        </div>
        {!kycStatus && (
          <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Verify with Civic
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Credit Score</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold">{creditScore}</p>
            <p className="text-gray-600">Out of 1000</p>
          </div>
          <div className="w-32 h-32">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10"/>
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="10"
                strokeDasharray={`${(creditScore / 1000) * 251.2} 251.2`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
