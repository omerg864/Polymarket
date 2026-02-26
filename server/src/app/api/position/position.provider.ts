import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PositionEntity } from '@shared/types/position.type';
import { Model } from 'mongoose';
import { Position, PositionDocument } from './position.model';

@Injectable()
export class PositionProvider {
  constructor(
    @InjectModel(Position.name)
    private positionModel: Model<PositionDocument>,
  ) {}

  async create(
    data: Omit<PositionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PositionEntity> {
    const created = new this.positionModel(data);
    return created.save();
  }

  async findByWalletId(walletId: string): Promise<PositionEntity[]> {
    return this.positionModel.find({ walletId });
  }

  async findByWalletIds(walletIds: string[]): Promise<PositionEntity[]> {
    if (walletIds.length === 0) return [];
    return this.positionModel.find({ walletId: { $in: walletIds } });
  }

  async findOne(id: string): Promise<PositionEntity | null> {
    return this.positionModel.findById(id);
  }

  async findByCondition(
    walletId: string,
    conditionId: string,
  ): Promise<PositionEntity | null> {
    return this.positionModel.findOne({ walletId, conditionId });
  }

  async upsert(
    walletId: string,
    conditionId: string,
    data: Partial<PositionEntity>,
  ): Promise<PositionEntity> {
    return this.positionModel.findOneAndUpdate(
      { walletId, conditionId },
      { $set: { ...data, walletId, conditionId } },
      { upsert: true, new: true },
    ) as Promise<PositionEntity>;
  }

  async update(
    id: string,
    data: Partial<PositionEntity>,
  ): Promise<PositionEntity | null> {
    return this.positionModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteByWalletId(walletId: string): Promise<void> {
    await this.positionModel.deleteMany({ walletId });
  }
}
