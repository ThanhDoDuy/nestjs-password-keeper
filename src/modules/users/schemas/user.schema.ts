import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

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
  timestamps: true,
})
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

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deleteddAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);