import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DEFAULT_SCHEMA } from '../constant/default.schema';

export type PasswordDocument = HydratedDocument<Password>;

@Schema(DEFAULT_SCHEMA)
export class Password {
  @Prop({
    required: true,
  })
  AppName: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  note?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })  // Referencing the 'User' model
  owner: mongoose.Schema.Types.ObjectId;  // This stores the _id of the user

  @Prop()
  deletedAt: Date;
}

export const PasswordSchema = SchemaFactory.createForClass(Password);