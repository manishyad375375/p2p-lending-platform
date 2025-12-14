import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig, createConfig } from 'wagmi';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { sepolia, localhost } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LendingPools from './pages/LendingPools';
import Profile from './pages/Profile';
import Governance from './pages/Governance';

const config = getDefaultConfig({
  appName: 'P2P Lending Platform',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [sepolia, localhost],
});

function App() {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pools" element={<LendingPools />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/governance" element={<Governance />} />
              </Routes>
            </main>
          </div>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
