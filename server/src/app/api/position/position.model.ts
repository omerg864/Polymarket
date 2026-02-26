import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PositionEntity } from '@shared/types/position.type';
import { HydratedDocument, Types } from 'mongoose';
import { Wallet } from '../wallet/wallet.model';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Position implements Omit<PositionEntity, 'id'> {
  @Prop({ type: Types.ObjectId, ref: Wallet.name, required: true })
  walletId: string;

  @Prop({ required: true })
  conditionId: string;

  @Prop()
  marketSlug?: string;

  @Prop()
  title?: string;

  @Prop({ required: true })
  stance: string;

  @Prop()
  outcome?: string;

  @Prop({ required: true, default: 0 })
  size: number;

  @Prop()
  avgPrice?: number;

  @Prop({ required: true, default: false })
  notified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type PositionDocument = HydratedDocument<Position>;
export const PositionSchema = SchemaFactory.createForClass(Position);

PositionSchema.index({ walletId: 1 });
PositionSchema.index({ walletId: 1, conditionId: 1 }, { unique: true });
