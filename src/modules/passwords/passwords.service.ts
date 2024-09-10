import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePasswordDto, UpdatePasswordDto } from '../../common/dto/create-password.dto';
import { Password } from '../../common/schemas/password.schema';
import { FailItemResponse } from 'src/common/interfaces/fail-item-response.interface';
import { IUser } from '../users/user.interface';
import { Role } from 'src/common/constant/role.enum';

@Injectable()
export class PasswordsService {
  constructor(@InjectModel(Password.name) private passwordModel: Model<Password>) { }

  async create(
    createPasswordDto: CreatePasswordDto,
    user: IUser
  ): Promise<Password> {
    const newPassword = new this.passwordModel({
      ...createPasswordDto,
      owner: user._id,
    });
    return await newPassword.save();
  }

  async findAll(user: IUser): Promise<{ data: Password[] }> {
    try {
      return {
        data: await this.passwordModel.find({
          owner: user._id
        }).exec()
      }
    } catch (error) {
      return {
        data: []
      }
    }
  }

  async findOne(id: string, user: IUser): Promise<Password> {
    const password = await this.passwordModel.findOne({
      _id: id,
      owner: user._id
    }).exec();
    if (!password) {
      throw new NotFoundException(`Password with ID ${id} not found.`);
    }
    return password;
  }

  async update(
    updatePasswordDto: UpdatePasswordDto,
    user: IUser
  ): Promise<Password | FailItemResponse> {
    // check if the password is deleted
    const password = await this.passwordModel.findOne({
      _id: updatePasswordDto._id,
      owner: user._id,
      isDeleted: false
    }).exec();
    if (!password) {
      throw new NotFoundException(`Password with ID ${updatePasswordDto._id} not found.`);
    }
    // update the password
    // this will also update the updatedAt field
    // if you want to keep the createdAt field, you need to use $currentDate operator in MongoDB
    // example: $currentDate: { field: "createdAt", timezone: "America/New_York" }
    const updatedPassword = await this.passwordModel
      .findOneAndUpdate({
        _id: updatePasswordDto._id,
        owner: user._id
      }, updatePasswordDto, { new: true })
      .exec();
    if (!updatedPassword) {
      throw new NotFoundException(`Password with ID ${updatePasswordDto._id} is deleted.`);
    }
    return updatedPassword;
  }

  async remove(
    deletePasswordDto: UpdatePasswordDto,
    user: IUser
  ): Promise<{ id: string }> {
    // check if the password is deleted
    const password = await this.passwordModel.findOne({
      _id: deletePasswordDto._id,
      owner: user._id,
      isDeleted: false
    }).exec();
    if (!password) {
      throw new NotFoundException(`Password with ID ${deletePasswordDto._id} is deleted.`);
    }
    const result = await this.passwordModel.findOneAndUpdate(
      {
        _id: deletePasswordDto._id,
        owner: user._id
      },{
        isDeleted: true,
        deletedBy: user._id,
        updatedAt: new Date()
      }
    ).exec();
    if (!result) {
      throw new NotFoundException(`Password with ID ${deletePasswordDto._id} not found.`);
    }
    return { id: deletePasswordDto._id }
  }

  async delete(
    deletePasswordDto: UpdatePasswordDto,
    user: IUser
  ): Promise<{ id: string }> {
    const result = await this.passwordModel.findOneAndDelete(
      {
        _id: deletePasswordDto._id,
      }
    ).exec();
    if (!result) {
      throw new NotFoundException(`Password with ID ${deletePasswordDto._id} not found.`);
    }
    return { id: deletePasswordDto._id }
  }
}
