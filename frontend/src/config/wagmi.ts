import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, sepolia, polygonMumbai } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const config = getDefaultConfig({
  appName: 'P2P Lending Platform',
  projectId,
  chains: [
    mainnet,
    polygon,
    arbitrum,
    optimism,
    ...(import.meta.env.DEV ? [sepolia, polygonMumbai] : []),
  ],
  ssr: false,
});