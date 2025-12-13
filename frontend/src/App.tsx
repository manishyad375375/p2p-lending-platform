import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from './config/wagmi';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Pools from './pages/Pools';
import MyLoans from './pages/MyLoans';
import Governance from './pages/Governance';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pools" element={<Pools />} />
                <Route path="/loans" element={<MyLoans />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;