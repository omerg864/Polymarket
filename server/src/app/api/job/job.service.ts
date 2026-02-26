import { Injectable, Logger } from '@nestjs/common';
import { WalletEntity } from '@shared/types/wallet.type';
import {
  EmailService,
  NewPositionEmailData,
} from '../../modules/email/email.service';
import {
  PolymarketPosition,
  PolymarketService,
} from '../../modules/polymarket/polymarket.service';
import { PositionService } from '../position/position.service';
import { UserService } from '../user/user.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    private readonly walletService: WalletService,
    private readonly positionService: PositionService,
    private readonly polymarketService: PolymarketService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  /**
   * Sync positions for all tracked wallets.
   * - Uses endDate + curPrice from the data-api to determine if a poll is closed.
   * - Closed polls: if existing in DB → update outcome; otherwise skip.
   * - Open polls: upsert, email only new ones.
   */
  async syncPositions(): Promise<{
    walletsProcessed: number;
    newPositionsFound: number;
    emailsSent: number;
  }> {
    const wallets = await this.walletService.findAll();
    this.logger.log(`Starting position sync for ${wallets.length} wallets`);

    const newPositionsByUser = new Map<
      string,
      {
        positions: NewPositionEmailData[];
        wallets: Map<string, WalletEntity>;
      }
    >();

    let totalNewPositions = 0;

    for (const wallet of wallets) {
      try {
        const apiPositions = await this.polymarketService.fetchPositions(
          wallet.address,
        );

        for (const apiPos of apiPositions) {
          const newPosition = await this.processPosition(wallet, apiPos);
          if (newPosition) {
            totalNewPositions++;

            if (!newPositionsByUser.has(wallet.userId)) {
              newPositionsByUser.set(wallet.userId, {
                positions: [],
                wallets: new Map(),
              });
            }

            const userData = newPositionsByUser.get(wallet.userId)!;
            userData.wallets.set(wallet.id, wallet);
            userData.positions.push(newPosition);
          }
        }
      } catch (error) {
        this.logger.error(`Error processing wallet ${wallet.address}:`, error);
      }
    }

    let emailsSent = 0;
    for (const [userId, { positions }] of newPositionsByUser) {
      try {
        const sent = await this.sendUserNotification(userId, positions);
        if (sent) emailsSent++;
      } catch (error) {
        this.logger.error(
          `Error sending notification to user ${userId}:`,
          error,
        );
      }
    }

    this.logger.log(
      `Position sync complete: ${wallets.length} wallets, ${totalNewPositions} new positions, ${emailsSent} emails sent`,
    );

    return {
      walletsProcessed: wallets.length,
      newPositionsFound: totalNewPositions,
      emailsSent,
    };
  }

  /**
   * Determine if a poll is closed using the position data itself.
   * A poll is closed when endDate is in the past.
   * When closed, curPrice indicates the resolution:
   *   curPrice >= 0.99 → user's side won (outcome = user's outcome)
   *   curPrice <= 0.01 → user's side lost (outcome = opposite)
   */
  private isPollClosed(apiPos: PolymarketPosition): {
    closed: boolean;
    winningOutcome: string | null;
  } {
    if (!apiPos.endDate) {
      return { closed: false, winningOutcome: null };
    }

    const endDate = new Date(apiPos.endDate);
    const now = new Date();

    if (endDate > now) {
      return { closed: false, winningOutcome: null };
    }

    // Poll has ended — determine winning outcome from curPrice
    if (apiPos.curPrice >= 0.99) {
      // User's side (apiPos.outcome) won
      return { closed: true, winningOutcome: apiPos.outcome };
    } else if (apiPos.curPrice <= 0.01) {
      // User's side lost → opposite outcome won
      const oppositeOutcome = apiPos.outcome === 'Yes' ? 'No' : 'Yes';
      return { closed: true, winningOutcome: oppositeOutcome };
    }

    // End date passed but price not settled yet (dispute, etc.)
    return { closed: true, winningOutcome: null };
  }

  /**
   * Process a single position from the Polymarket API.
   * - Closed polls: only update existing DB records; skip new ones.
   * - Open polls: upsert, return email data if new.
   */
  private async processPosition(
    wallet: WalletEntity,
    apiPos: PolymarketPosition,
  ): Promise<NewPositionEmailData | null> {
    const { closed, winningOutcome } = this.isPollClosed(apiPos);

    const existing = await this.positionService.findByCondition(
      wallet.id,
      apiPos.conditionId,
    );

    if (closed) {
      // Closed poll — only update if already tracked
      if (existing) {
        await this.positionService.upsert(wallet.id, apiPos.conditionId, {
          stance: apiPos.outcome,
          outcome: winningOutcome || undefined,
          size: apiPos.size,
        });
      }
      return null;
    }

    // Open poll — upsert with latest data
    if (existing) {
      await this.positionService.upsert(wallet.id, apiPos.conditionId, {
        title: apiPos.title,
        marketSlug: apiPos.eventSlug,
        stance: apiPos.outcome,
        size: apiPos.size,
        avgPrice: apiPos.avgPrice,
      });
      return null;
    }

    // New open position — create and track for notification
    await this.positionService.upsert(wallet.id, apiPos.conditionId, {
      title: apiPos.title,
      marketSlug: apiPos.eventSlug,
      stance: apiPos.outcome,
      size: apiPos.size,
      avgPrice: apiPos.avgPrice,
      notified: false,
    });

    return {
      walletLabel: wallet.label,
      walletAddress: wallet.address,
      conditionId: apiPos.conditionId,
      title: apiPos.title,
      stance: apiPos.outcome,
      size: apiPos.size,
      avgPrice: apiPos.avgPrice,
    };
  }

  private async sendUserNotification(
    userId: string,
    positions: NewPositionEmailData[],
  ): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      this.logger.warn(`User ${userId} not found, skipping notification`);
      return false;
    }

    const sent = await this.emailService.sendNewPositionsEmail(
      user.email,
      user.name,
      positions,
    );

    if (sent) {
      this.logger.log(
        `Sent notification to ${user.email} for ${positions.length} new positions`,
      );
    }

    return sent;
  }
}
