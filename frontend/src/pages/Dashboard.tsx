import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { address, isConnected } = useAccount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Wallet</h2>
          {isConnected ? (
            <>
              <p className="text-sm text-gray-400 mb-2">Connected address</p>
              <p className="font-mono break-all">{address}</p>
            </>
          ) : (
            <p className="text-gray-400">Connect your wallet to start lending or borrowing.</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Lending Pools</h2>
          <p className="text-gray-400 mb-4">
            View available pools, supply liquidity, or borrow against your deposits.
          </p>
          <Link to="/pools" className="btn-primary inline-block text-center w-full">
            View Pools
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Governance</h2>
          <p className="text-gray-400 mb-4">
            Participate in DAO voting and help shape platform parameters.
          </p>
          <Link to="/governance" className="btn-secondary inline-block text-center w-full">
            Open Governance
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
