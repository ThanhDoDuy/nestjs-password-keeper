import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DEFAULT_SCHEMA } from 'src/common/constant/default.schema';

export type UserDocument = HydratedDocument<User>;

@Schema(DEFAULT_SCHEMA)
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop()
  name: string;

  @Prop({ default: false })
  verify: boolean;

  @Prop({ default: false })
  address: string;

  @Prop({ default: 'USER' })
  role: string;

  @Prop()
  refresh_token: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);