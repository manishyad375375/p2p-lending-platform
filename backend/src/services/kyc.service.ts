import { ethers } from 'ethers';
import { getProvider, getBackendSigner } from '../config/blockchain';
import { logger } from '../utils/logger';

const KYC_REGISTRY_ABI = [
  'function setKYC(address user, bool verified) external',
  'function isKycVerified(address user) view returns (bool)',
];

export class KYCService {
  private contract: ethers.Contract;

  constructor() {
    const signer = getBackendSigner();
    const address = process.env.KYC_REGISTRY_ADDRESS || '';
    this.contract = new ethers.Contract(address, KYC_REGISTRY_ABI, signer);
  }

  async setKYCStatus(userAddress: string, verified: boolean, provider: string): Promise<string> {
    try {
      logger.info(`Setting KYC status for ${userAddress}: ${verified} via ${provider}`);
      const tx = await this.contract.setKYC(userAddress, verified);
      await tx.wait();
      logger.info(`KYC status set on-chain: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      logger.error('Set KYC status error:', error);
      throw error;
    }
  }

  async getKYCStatus(userAddress: string): Promise<{ address: string; verified: boolean; onChain: boolean }> {
    try {
      const verified = await this.contract.isKycVerified(userAddress);
      return {
        address: userAddress,
        verified,
        onChain: true,
      };
    } catch (error) {
      logger.error('Get KYC status error:', error);
      return {
        address: userAddress,
        verified: false,
        onChain: false,
      };
    }
  }
}
