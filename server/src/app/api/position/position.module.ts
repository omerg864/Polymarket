import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletModule } from '../wallet/wallet.module';
import { PositionController } from './position.controller';
import { Position, PositionSchema } from './position.model';
import { PositionProvider } from './position.provider';
import { PositionService } from './position.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Position.name, schema: PositionSchema },
    ]),
    WalletModule,
  ],
  controllers: [PositionController],
  providers: [PositionService, PositionProvider],
  exports: [PositionService],
})
export class PositionModule {}
