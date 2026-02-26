import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletController } from './wallet.controller';
import { Wallet, WalletSchema } from './wallet.model';
import { WalletProvider } from './wallet.provider';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletProvider],
  exports: [WalletService],
})
export class WalletModule {}
