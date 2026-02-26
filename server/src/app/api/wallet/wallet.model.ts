import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WalletEntity } from '@shared/types/wallet.type';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Wallet implements Omit<WalletEntity, 'id'> {
  @Prop({ required: true })
  address: string;

  @Prop()
  label?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  createdAt: Date;
  updatedAt: Date;
}

export type WalletDocument = HydratedDocument<Wallet>;
export const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.index({ userId: 1 });
WalletSchema.index({ address: 1, userId: 1 }, { unique: true });
