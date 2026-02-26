import { Injectable } from '@nestjs/common';
import { PositionEntity } from '@shared/types/position.type';
import { PositionProvider } from './position.provider';

@Injectable()
export class PositionService {
  constructor(private readonly positionProvider: PositionProvider) {}

  async create(
    data: Omit<PositionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PositionEntity> {
    return this.positionProvider.create(data);
  }

  async findByWalletId(walletId: string): Promise<PositionEntity[]> {
    return this.positionProvider.findByWalletId(walletId);
  }

  async findByWalletIds(walletIds: string[]): Promise<PositionEntity[]> {
    return this.positionProvider.findByWalletIds(walletIds);
  }

  async findOne(id: string): Promise<PositionEntity | null> {
    return this.positionProvider.findOne(id);
  }

  async findByCondition(
    walletId: string,
    conditionId: string,
  ): Promise<PositionEntity | null> {
    return this.positionProvider.findByCondition(walletId, conditionId);
  }

  async upsert(
    walletId: string,
    conditionId: string,
    data: Partial<PositionEntity>,
  ): Promise<PositionEntity> {
    return this.positionProvider.upsert(walletId, conditionId, data);
  }

  async markNotified(id: string): Promise<PositionEntity | null> {
    return this.positionProvider.update(id, { notified: true });
  }

  async deleteByWalletId(walletId: string): Promise<void> {
    return this.positionProvider.deleteByWalletId(walletId);
  }
}
