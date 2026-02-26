import { Module } from '@nestjs/common';
import { AppI18nModule } from '../i18n/app-i18n.module';
import { EmailService } from './email.service';

@Module({
  imports: [AppI18nModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
