import { GraphQLClient } from 'graphql-request';
import { logger } from '../utils/logger';

export class GraphService {
  private client: GraphQLClient;

  constructor() {
    const url = process.env.GRAPH_API_URL || '';
    this.client = new GraphQLClient(url);
  }

  async getUserActivity(address: string): Promise<any> {
    try {
      const query = `
        query GetUserActivity($address: String!) {
          user(id: $address) {
            totalLoans
            totalRepaid
            kycVerified
            deposits {
              amount
              timestamp
            }
            borrows {
              amount
              timestamp
            }
            repayments {
              amount
              timestamp
            }
          }
        }
      `;

      const data = await this.client.request(query, { address: address.toLowerCase() });
      return data.user || { totalLoans: 0, totalRepaid: 0, kycVerified: false };
    } catch (error) {
      logger.error('Get user activity error:', error);
      // Return default values if Graph is not available
      return { totalLoans: 0, totalRepaid: 0, kycVerified: false };
    }
  }

  async getScoreHistory(address: string): Promise<any[]> {
    try {
      const query = `
        query GetScoreHistory($address: String!) {
          scoreUpdates(where: { user: $address }, orderBy: timestamp, orderDirection: desc) {
            score
            timestamp
            txHash
          }
        }
      `;

      const data = await this.client.request(query, { address: address.toLowerCase() });
      return data.scoreUpdates || [];
    } catch (error) {
      logger.error('Get score history error:', error);
      return [];
    }
  }

  async getPlatformStats(): Promise<any> {
    try {
      const query = `
        query GetPlatformStats {
          platform(id: "1") {
            totalValueLocked
            totalBorrowed
            totalUsers
            totalLoans
          }
        }
      `;

      const data = await this.client.request(query);
      return data.platform || {};
    } catch (error) {
      logger.error('Get platform stats error:', error);
      return {};
    }
  }
}
