import { Injectable } from '@nestjs/common';
import { WalletEntity } from '@shared/types/wallet.type';
import { WalletProvider } from './wallet.provider';

@Injectable()
export class WalletService {
  constructor(private readonly walletProvider: WalletProvider) {}

  async create(
    data: Omit<WalletEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WalletEntity> {
    return this.walletProvider.create(data);
  }

  async findByUserId(userId: string): Promise<WalletEntity[]> {
    return this.walletProvider.findByUserId(userId);
  }

  async findOne(id: string): Promise<WalletEntity | null> {
    return this.walletProvider.findOne(id);
  }

  async findAll(): Promise<WalletEntity[]> {
    return this.walletProvider.findAll();
  }

  async update(
    id: string,
    data: Partial<WalletEntity>,
  ): Promise<WalletEntity | null> {
    return this.walletProvider.update(id, data);
  }

  async remove(id: string): Promise<WalletEntity | null> {
    return this.walletProvider.delete(id);
  }
}
