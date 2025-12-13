import { ethers } from 'ethers';
import { getProvider } from '../config/blockchain';
import { getBackendSigner } from '../config/blockchain';
import { logger } from '../utils/logger';
import { GraphService } from './graph.service';

const CREDIT_SCORE_ABI = [
  'function updateScore(address user, uint256 newScore, uint256 totalLoans, uint256 totalRepaid, bool kycVerified) external',
  'function getScore(address user) view returns (uint256 score, uint256 lastUpdated, uint256 totalLoans, uint256 totalRepaid, bool kycVerified)',
];

interface ScoreData {
  score: number;
  totalLoans: number;
  totalRepaid: number;
  kycVerified: boolean;
}

export class ScoreService {
  private contract: ethers.Contract;
  private graphService: GraphService;

  constructor() {
    const signer = getBackendSigner();
    const address = process.env.CREDIT_SCORE_ADDRESS || '';
    this.contract = new ethers.Contract(address, CREDIT_SCORE_ABI, signer);
    this.graphService = new GraphService();
  }

  async getScore(userAddress: string): Promise<any> {
    try {
      const scoreData = await this.contract.getScore(userAddress);
      return {
        address: userAddress,
        score: scoreData[0].toString(),
        lastUpdated: scoreData[1].toString(),
        totalLoans: scoreData[2].toString(),
        totalRepaid: scoreData[3].toString(),
        kycVerified: scoreData[4],
      };
    } catch (error) {
      logger.error('Get score error:', error);
      throw error;
    }
  }

  async computeScore(userAddress: string): Promise<ScoreData> {
    try {
      // Fetch user's on-chain activity from The Graph or direct RPC
      const activity = await this.graphService.getUserActivity(userAddress);

      // Simple scoring algorithm (can be enhanced)
      let score = 500; // base score

      // Increase for successful repayments
      const repaymentRate = activity.totalLoans > 0 ? activity.totalRepaid / activity.totalLoans : 0;
      score += Math.floor(repaymentRate * 300);

      // Increase for loan count (experience)
      score += Math.min(activity.totalLoans * 5, 100);

      // KYC bonus
      if (activity.kycVerified) {
        score += 100;
      }

      // Cap at 1000
      score = Math.min(score, 1000);

      logger.info(`Computed score for ${userAddress}: ${score}`);

      return {
        score,
        totalLoans: activity.totalLoans,
        totalRepaid: activity.totalRepaid,
        kycVerified: activity.kycVerified,
      };
    } catch (error) {
      logger.error('Compute score error:', error);
      throw error;
    }
  }

  async updateScoreOnChain(userAddress: string, scoreData: ScoreData): Promise<string> {
    try {
      logger.info(`Updating score on-chain for ${userAddress}`);
      const tx = await this.contract.updateScore(
        userAddress,
        scoreData.score,
        scoreData.totalLoans,
        scoreData.totalRepaid,
        scoreData.kycVerified
      );
      await tx.wait();
      logger.info(`Score updated on-chain: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      logger.error('Update score on-chain error:', error);
      throw error;
    }
  }

  async getScoreHistory(userAddress: string): Promise<any[]> {
    try {
      // Fetch historical score updates from The Graph
      const history = await this.graphService.getScoreHistory(userAddress);
      return history;
    } catch (error) {
      logger.error('Get score history error:', error);
      return [];
    }
  }
}
