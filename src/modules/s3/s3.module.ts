// src/s3/s3.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { FileController } from './s3.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])
  ],
  providers: [S3Service],
  controllers: [FileController],
  exports: [S3Service],
})
export class S3Module {}
