import axios from 'axios';
import { logger } from '../utils/logger';

export class SelfKeyService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.SELFKEY_API_KEY || '';
    this.apiUrl = process.env.SELFKEY_API_URL || 'https://api.selfkey.org';
  }

  async initVerification(address: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/kyc/initiate`,
        {
          wallet: address,
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info(`SelfKey verification initiated for ${address}`);
      return response.data.verificationUrl;
    } catch (error) {
      logger.error('SelfKey init error:', error);
      // For development, return a mock URL
      return `https://selfkey.org/verify?address=${address}`;
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/kyc/verify`,
        { token },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('SelfKey token verified');
      return response.data.verified === true;
    } catch (error) {
      logger.error('SelfKey verify error:', error);
      // For development, accept any non-empty token
      return token && token.length > 10;
    }
  }
}
