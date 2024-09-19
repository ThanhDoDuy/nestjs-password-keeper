// src/files/file.controller.ts
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { User } from 'src/decorators/customize.decorator';
import { IUser } from '../users/user.interface';

@Controller('files')
export class FileController {
  constructor(private readonly s3Service: S3Service) { }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files')) // Accept an array of files
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: IUser
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }
    if ( files.length >= 10) {
      throw new HttpException(
        'Too much files, limitations is 10 per request', HttpStatus.BAD_REQUEST);
    }
    try {
      const result = await this.s3Service.uploadMultipleFiles(files, user);
      return result;
    } catch (error) {
      throw new HttpException(
        `Upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get all files for a specific user
  @Get()
  async getFiles(@User() user: IUser) {
    if (!user) {
      throw new HttpException('Missing user', HttpStatus.BAD_REQUEST);
    }

    try {
      const files = await this.s3Service.getFilesByUser(user._id);
      return files;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch files: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get a single file by its ID
  @Get(':id')
  async getFileById(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    try {
      return await this.s3Service.getFileById(id, user._id);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Failed to fetch file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
