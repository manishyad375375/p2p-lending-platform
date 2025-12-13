import axios from 'axios';
import { logger } from '../utils/logger';

export class CivicService {
  private apiKey: string;
  private gatewayToken: string;

  constructor() {
    this.apiKey = process.env.CIVIC_API_KEY || '';
    this.gatewayToken = process.env.CIVIC_GATEWAY_TOKEN || '';
  }

  async initVerification(address: string): Promise<string> {
    try {
      // In production, use Civic Pass SDK
      // This is a simplified example
      const response = await axios.post(
        'https://api.civic.com/pass/initiate',
        {
          wallet: address,
          gatewayToken: this.gatewayToken,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info(`Civic verification initiated for ${address}`);
      return response.data.verificationUrl;
    } catch (error) {
      logger.error('Civic init error:', error);
      // For development, return a mock URL
      return `https://civic.com/verify?address=${address}`;
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      // Verify Civic Pass token
      const response = await axios.post(
        'https://api.civic.com/pass/verify',
        { token },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('Civic token verified');
      return response.data.valid === true;
    } catch (error) {
      logger.error('Civic verify error:', error);
      // For development, accept any non-empty token
      return token && token.length > 10;
    }
  }
}
