import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, CREDIT_SCORE_ABI, KYC_REGISTRY_ABI } from '../config/contracts';

const Profile = () => {
  const { address, isConnected } = useAccount();

  const { data: scoreData } = useReadContract({
    address: CONTRACT_ADDRESSES.CREDIT_SCORE as `0x${string}`,
    abi: CREDIT_SCORE_ABI,
    functionName: 'getScore',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && CONTRACT_ADDRESSES.CREDIT_SCORE.length > 0,
    },
  });

  const { data: kycVerified } = useReadContract({
    address: CONTRACT_ADDRESSES.KYC_REGISTRY as `0x${string}`,
    abi: KYC_REGISTRY_ABI,
    functionName: 'isKycVerified',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && CONTRACT_ADDRESSES.KYC_REGISTRY.length > 0,
    },
  });

  const score = Array.isArray(scoreData) ? scoreData[0] : undefined;
  const totalLoans = Array.isArray(scoreData) ? scoreData[2] : undefined;
  const totalRepaid = Array.isArray(scoreData) ? scoreData[3] : undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      {!isConnected ? (
        <div className="card">
          <p className="text-gray-400">Connect your wallet to view your P2P lending profile.</p>
        </div>
      ) : (
        <>
          <div className="card">
            <h2 className="text-xl font-semibold mb-2">Identity & Credit</h2>
            <p className="text-sm text-gray-400 mb-2">Address</p>
            <p className="font-mono break-all mb-4">{address}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">KYC Status</p>
                <p className={kycVerified ? 'text-green-400' : 'text-yellow-400'}>
                  {kycVerified ? 'Verified (Civic/SelfKey or provider)' : 'Not verified'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Credit Score</p>
                <p className="text-primary-300">{score ? score.toString() : 'N/A'}/1000</p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Loan Performance</p>
                <p className="text-gray-200">
                  Loans: {totalLoans ? totalLoans.toString() : '0'} | Repaid: {totalRepaid ? totalRepaid.toString() : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-2">How KYC Works</h2>
            <p className="text-gray-400 text-sm">
              KYC verification is performed off-chain by integrated providers such as Civic or SelfKey. Once verified,
              a provider updates your on-chain status in the KYC registry, which can then be used by the credit scoring
              and lending logic.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
