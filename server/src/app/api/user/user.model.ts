import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserEntity } from '@shared/types/user.type';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'user',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User implements UserEntity {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  emailVerified: boolean;

  @Prop()
  image?: string;

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
