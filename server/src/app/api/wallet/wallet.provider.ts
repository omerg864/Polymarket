import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WalletEntity } from '@shared/types/wallet.type';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from './wallet.model';

@Injectable()
export class WalletProvider {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  async create(
    data: Omit<WalletEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WalletEntity> {
    const created = new this.walletModel(data);
    return created.save();
  }

  async findByUserId(userId: string): Promise<WalletEntity[]> {
    return this.walletModel.find({ userId });
  }

  async findOne(id: string): Promise<WalletEntity | null> {
    return this.walletModel.findById(id);
  }

  async findAll(): Promise<WalletEntity[]> {
    return this.walletModel.find();
  }

  async update(
    id: string,
    data: Partial<WalletEntity>,
  ): Promise<WalletEntity | null> {
    return this.walletModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<WalletEntity | null> {
    return this.walletModel.findByIdAndDelete(id);
  }
}
