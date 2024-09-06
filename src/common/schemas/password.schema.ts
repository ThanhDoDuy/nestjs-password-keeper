import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DEFAULT_SCHEMA } from '../constant/default.schema';

@Schema(DEFAULT_SCHEMA)
export class Password extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  AppName: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  note?: string;
}

export const PasswordSchema = SchemaFactory.createForClass(Password);