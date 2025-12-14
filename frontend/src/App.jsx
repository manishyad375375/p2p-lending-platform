import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LendingPools from './pages/LendingPools';
import Profile from './pages/Profile';
import Governance from './pages/Governance';

function App() {
  return (
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
  );
}

export default App;
