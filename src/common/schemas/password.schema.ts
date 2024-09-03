import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  toJSON: {
    virtuals: true,
    versionKey: false,  // Removes __v
    transform: (doc, ret) => {
      ret.id = ret._id;  // Map _id to id
      delete ret._id;    // Remove _id
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,  // Removes __v
    transform: (doc, ret) => {
      ret.id = ret._id;  // Map _id to id
      delete ret._id;    // Remove _id
      return ret;
    },
  },
})
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