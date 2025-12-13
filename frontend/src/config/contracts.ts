export const CONTRACT_ADDRESSES = {
  LENDING_POOL: import.meta.env.VITE_LENDING_POOL_ADDRESS || '',
  CREDIT_SCORE: import.meta.env.VITE_CREDIT_SCORE_ADDRESS || '',
  KYC_REGISTRY: import.meta.env.VITE_KYC_REGISTRY_ADDRESS || '',
  PLATFORM_TOKEN: import.meta.env.VITE_PLATFORM_TOKEN_ADDRESS || '',
  GOVERNANCE: import.meta.env.VITE_GOVERNANCE_ADDRESS || '',
};

export const LENDING_POOL_ABI = [
  'function deposit(bytes32 poolId, uint256 amount) external',
  'function withdraw(bytes32 poolId, uint256 amount) external',
  'function borrow(bytes32 poolId, uint256 amount) external',
  'function repay(bytes32 poolId, uint256 amount) external',
  'function positions(bytes32 poolId, address user) view returns (uint256 deposited, uint256 borrowed, uint256 debtIndex)',
  'function pools(bytes32 poolId) view returns (address asset, uint256 ltv, uint256 baseRate, uint256 utilRateSlope1, uint256 utilRateSlope2, uint256 kink, bool isActive)',
  'function getPoolId(address asset) view returns (bytes32)',
];

export const CREDIT_SCORE_ABI = [
  'function getScore(address user) view returns (uint256 score, uint256 lastUpdated, uint256 totalLoans, uint256 totalRepaid, bool kycVerified)',
];

export const KYC_REGISTRY_ABI = [
  'function isKycVerified(address user) view returns (bool)',
];

export const PLATFORM_TOKEN_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];