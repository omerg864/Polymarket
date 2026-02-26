import {
  CreateWalletSchema,
  UpdateWalletSchema,
} from '@shared/schemas/wallet.schemas';
import { WalletEntity } from '@shared/types/wallet.type';
import { createZodDto } from 'nestjs-zod';

export class CreateWalletDto extends createZodDto(CreateWalletSchema) {}

export class UpdateWalletDto extends createZodDto(UpdateWalletSchema) {}

export type WalletDto = WalletEntity;
