import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DEFAULT_SCHEMA } from 'src/common/constant/default.schema';

export type FileDocument = HydratedDocument<File>;

@Schema(DEFAULT_SCHEMA)
export class File {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })  // Referencing the 'User' model
  owner: mongoose.Schema.Types.ObjectId;  // This stores the _id of the user

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  s3Url: string;

  @Prop({ required: true })
  s3Key: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;

  // Include _id as a string type (or Types.ObjectId if needed)
  readonly _id: mongoose.Schema.Types.ObjectId;
}

export const FileSchema = SchemaFactory.createForClass(File);