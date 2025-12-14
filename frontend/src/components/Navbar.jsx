import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [account, setAccount] = React.useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              P2P Lending
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
                Dashboard
              </Link>
              <Link to="/pools" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
                Pools
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
                Profile
              </Link>
              <Link to="/governance" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
                Governance
              </Link>
            </div>
          </div>
          
          <div>
            {account ? (
              <div className="bg-indigo-100 px-4 py-2 rounded-lg">
                <span className="text-indigo-700 font-mono text-sm">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
