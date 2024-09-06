import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto, UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { buildFailItemResponse } from 'src/utils/response';
import { ErrorCode } from 'src/utils/error-code';
import { MSG_ERR_NOT_FOUND, MSG_ERR_WHEN_DELETE, MSG_ERR_WHEN_UPDATE } from 'src/utils/message.constant';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const createUser = new this.UserModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createUser.save();
  }

  async findAll() {
    try {
      return this.UserModel.find();
    } catch (error) {
      return buildFailItemResponse(ErrorCode.BAD_REQUEST, MSG_ERR_NOT_FOUND);
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null 
    }
    return this.UserModel.findById(id);
  }

  findOneByUserName(username: string) {
    return this.UserModel.findOne({
      email: username
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      return this.UserModel.updateOne({_id: updateUserDto._id}, updateUserDto);
    } catch (error) {
      return buildFailItemResponse(ErrorCode.BAD_REQUEST, MSG_ERR_WHEN_UPDATE);
    };
  }

  async remove(deleteUserDto: DeleteUserDto) {
    try {
      return this.UserModel.updateOne({
        _id: deleteUserDto._id,
      }, { isDeleted: true, deleteddAt: new Date()}
    );
    } catch (error) {
      return buildFailItemResponse(ErrorCode.BAD_REQUEST, MSG_ERR_WHEN_DELETE);
    };
  }

  async isValidPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
