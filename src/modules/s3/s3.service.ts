// src/s3/s3.service.ts
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { S3 } from 'aws-sdk';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { File } from './schemas/file.schema';
import { IUser } from '../users/user.interface';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(File.name)
    private fileModel: Model<File>
  ) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  // Method to upload a single file to S3
  async uploadFileToUserFolder(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ key: string; url: string }> {
    // Validate file type
    const allowedTypes = /jpg|jpeg|png|txt|pdf/;
    if (!allowedTypes.test(file.mimetype)) {
      throw new HttpException(
        'Invalid file type. Only JPG, PNG, TXT, and PDF files are allowed.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const fileName = `${uuidv4()}-${file.originalname}`;
    const fileKey = `users/${userId}/${fileName}`; // User-specific folder
    try {
      const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype
      };

      const data = await this.s3.upload(params).promise();

      return {
        key: data.Key,
        url: data.Location,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to upload file to S3: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Method to upload multiple files to S3
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    user: IUser
  ): Promise<{ success: any[]; failed: any[] }> {
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        try {
          const result = await this.uploadFileToUserFolder(user._id, file);
          const fileData = await this.saveFileMetadata(user._id, file.originalname, result.url, result.key);
          return { file: file.originalname, status: 'success', data: { ...result,  _id: fileData._id  } };
        } catch (error) {
          return { file: file.originalname, status: 'failed', message: error.message };
        }
      }),
    );

    // Separate successful and failed uploads
    const success = uploadResults.filter(result => result.status === 'success').map(result => result.data);
    const failed = uploadResults.filter(result => result.status === 'failed');

    return { success, failed };
  }

  async saveFileMetadata(userId: string, fileName: string, s3Url: string, s3Key: string): Promise<File> {
    const newFile = new this.fileModel({
      owner: userId,
      fileName,
      s3Url,
      s3Key
    });
    return await newFile.save();
  }

  // Method to generate a pre-signed URL for a file
  getPresignedUrl(
    userId: string, fileName: string, s3Key?: string): string {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const fileKey = `users/${userId}/${fileName}`;  // Construct the file path in S3
    try {
      const params = {
        Bucket: bucketName,
        Key: s3Key || fileKey,
        Expires: 60 * 60, // URL expires in 60 minutes
      };

      // Generate a pre-signed URL
      const url = this.s3.getSignedUrl('getObject', params);
      return url;
    } catch (error) {
      throw new HttpException(
        `Failed to generate pre-signed URL: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get all files for a specific user
  async getFilesByUser(userId: string): Promise<File[]> {
    const files = await this.fileModel.find({ owner: userId })
      .select('fileName s3Key').lean().lean().exec();
    // Add a pre-signed URL to each file object
    return files.map(file => {
      const presignedUrl = this.getPresignedUrl(userId, file.fileName, file.s3Key);
      return {
        ...file,
        url: presignedUrl,
      };
    });
  }

  // Get a single file by its ID
  async getFileById(id: string, userId: string): Promise<any> {
    const file = await this.fileModel.findOne({
      _id: id,
      owner: userId,
    }).select('fileName s3Key').lean().lean().exec();
    if (!file) {
      throw new NotFoundException('File not found');
    }
    const presignedUrl = this.getPresignedUrl(userId, file.fileName, file.s3Key);
    return {
      ...file,
      url: presignedUrl,
    };
  }
}
