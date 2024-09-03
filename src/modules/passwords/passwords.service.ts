import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePasswordDto, UpdatePasswordDto } from '../../common/dto/create-password.dto';
import { Password } from '../../common/schemas/password.schema';
import { buildFailItemResponse } from 'src/utils/response';
import { ErrorCode } from 'src/utils/error-code';
import { MSG_ERR_NOT_FOUND, MSG_ERR_WHEN_CREATE, MSG_ERR_WHEN_DELETE, MSG_ERR_WHEN_UPDATE } from '../../utils/message.constant';
import { FailItemResponse } from 'src/common/interfaces/fail-item-response.interface';

@Injectable()
export class PasswordsService {
  constructor(@InjectModel(Password.name) private passwordModel: Model<Password>) { }

  async create(createPasswordDto: CreatePasswordDto): Promise<Password | FailItemResponse> {
    try {
      const newPassword = new this.passwordModel(createPasswordDto);
      return await newPassword.save();
    } catch (error) {
      return buildFailItemResponse(
        ErrorCode.BAD_REQUEST, MSG_ERR_WHEN_CREATE, createPasswordDto);
    }
  }

  async findAll(): Promise<{data: Password[]}> {
    try {
      return {
        data: await this.passwordModel.find().exec()
      }
    } catch (error) {
      return {
        data: []
      }
    }
  }

  async findOne(id: string): Promise<Password | FailItemResponse> {
    try {
      const password = await this.passwordModel.findById(id).exec();
      if (!password) {
        throw new NotFoundException(`Password with ID ${id} not found.`);
      }
      return password;
    } catch (error) {
      return buildFailItemResponse(ErrorCode.BAD_REQUEST, MSG_ERR_NOT_FOUND);
    }
  }

  async update(
    updatePasswordDto: UpdatePasswordDto
  ): Promise<Password | FailItemResponse> {
    try {
      const updatedPassword = await this.passwordModel
        .findByIdAndUpdate(updatePasswordDto.id, updatePasswordDto, { new: true })
        .exec();
      if (!updatedPassword) {
        throw new NotFoundException(`Password with ID ${updatePasswordDto.id} not found.`);
      }
      return updatedPassword;
    } catch (error) {
      return buildFailItemResponse(ErrorCode.BAD_REQUEST, MSG_ERR_WHEN_UPDATE);
    }
  }

  async remove(deletePasswordDto: UpdatePasswordDto): Promise<{ id: string } | FailItemResponse> {
    try {
      const result = await this.passwordModel.findByIdAndDelete(
        deletePasswordDto.id).exec();
      if (!result) {
        throw new NotFoundException(`Password with ID ${deletePasswordDto.id} not found.`);
      }
      return { id: deletePasswordDto.id }
    } catch (error) {
      return buildFailItemResponse(ErrorCode.BAD_REQUEST, MSG_ERR_WHEN_DELETE);
    }
  }
}
