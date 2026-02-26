import { Injectable, Logger } from '@nestjs/common';

export type PolymarketPosition = {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  size: number;
  avgPrice: number;
  curPrice: number;
  initialValue: number;
  currentValue: number;
  cashPnl: number;
  percentPnl: number;
  totalBought: number;
  realizedPnl: number;
  title: string;
  slug: string;
  icon: string;
  eventSlug: string;
  outcome: string;
  outcomeIndex: number;
  endDate: string;
  negativeRisk: boolean;
};

const POLYMARKET_DATA_API = 'https://data-api.polymarket.com';

@Injectable()
export class PolymarketService {
  private readonly logger = new Logger(PolymarketService.name);

  /**
   * Fetch all positions for a given wallet address from Polymarket Data API.
   */
  async fetchPositions(walletAddress: string): Promise<PolymarketPosition[]> {
    const url = `${POLYMARKET_DATA_API}/positions?user=${encodeURIComponent(walletAddress)}`;

    try {
      this.logger.debug(`Fetching positions for wallet: ${walletAddress}`);
      const response = await fetch(url);

      if (!response.ok) {
        this.logger.error(
          `Polymarket API error: ${response.status} ${response.statusText}`,
        );
        return [];
      }

      const data = (await response.json()) as PolymarketPosition[];
      this.logger.debug(
        `Found ${data.length} positions for wallet: ${walletAddress}`,
      );
      return data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch positions for wallet ${walletAddress}:`,
        error,
      );
      return [];
    }
  }
}
