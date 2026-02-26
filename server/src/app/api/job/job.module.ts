import { Module } from '@nestjs/common';
import { EmailModule } from '../../modules/email/email.module';
import { PolymarketModule } from '../../modules/polymarket/polymarket.module';
import { PositionModule } from '../position/position.module';
import { UserModule } from '../user/user.module';
import { WalletModule } from '../wallet/wallet.module';
import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
  imports: [
    WalletModule,
    PositionModule,
    PolymarketModule,
    EmailModule,
    UserModule,
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
