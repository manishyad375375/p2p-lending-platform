import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, LENDING_POOL_ABI } from '../config/contracts';

const Pools = () => {
  const { address, isConnected } = useAccount();
  const [assetAddress, setAssetAddress] = useState('');
  const [amount, setAmount] = useState('');

  const { data: poolId } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
    abi: LENDING_POOL_ABI,
    functionName: 'getPoolId',
    args: assetAddress && assetAddress.startsWith('0x') ? [assetAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!assetAddress && assetAddress.startsWith('0x') && CONTRACT_ADDRESSES.LENDING_POOL.length > 0,
    },
  });

  const { data: position } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
    abi: LENDING_POOL_ABI,
    functionName: 'positions',
    args:
      poolId && address
        ? [poolId as `0x${string}`, address as `0x${string}`]
        : undefined,
    query: {
      enabled: !!poolId && !!address && CONTRACT_ADDRESSES.LENDING_POOL.length > 0,
    },
  });

  const { writeContractAsync, isPending } = useWriteContract();

  const handleDeposit = async () => {
    if (!poolId || !amount) return;
    await writeContractAsync({
      address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
      abi: LENDING_POOL_ABI,
      functionName: 'deposit',
      args: [poolId as `0x${string}`, parseUnits(amount, 18)],
    });
  };

  const handleBorrow = async () => {
    if (!poolId || !amount) return;
    await writeContractAsync({
      address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
      abi: LENDING_POOL_ABI,
      functionName: 'borrow',
      args: [poolId as `0x${string}`, parseUnits(amount, 18)],
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Lending Pools</h1>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">Interact with a Pool</h2>
        <p className="text-gray-400 text-sm">
          Enter the ERC20 token address of a supported asset to derive the pool ID. This MVP assumes a pool
          already exists for that token.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Asset Token Address</label>
            <input
              className="input"
              placeholder="0x..."
              value={assetAddress}
              onChange={(e) => setAssetAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              className="input"
              type="number"
              min="0"
              step="0.0001"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <button
              className="btn-primary flex-1"
              onClick={handleDeposit}
              disabled={!isConnected || !poolId || !amount || isPending}
            >
              Deposit
            </button>
            <button
              className="btn-secondary flex-1"
              onClick={handleBorrow}
              disabled={!isConnected || !poolId || !amount || isPending}
            >
              Borrow
            </button>
          </div>
        </div>

        {position && (
          <div className="mt-4 text-sm text-gray-300">
            <p>Deposited: {position[0]?.toString?.() ?? position[0]} wei</p>
            <p>Borrowed: {position[1]?.toString?.() ?? position[1]} wei</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pools;
