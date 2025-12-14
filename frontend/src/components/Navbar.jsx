import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              P2P Lending
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Dashboard</Link>
              <Link to="/pools" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Pools</Link>
              <Link to="/profile" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Profile</Link>
              <Link to="/governance" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Governance</Link>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
