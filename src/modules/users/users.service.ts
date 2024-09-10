import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { DeleteUserDto, UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { buildFailItemResponse } from 'src/utils/response';
import { ErrorCode } from 'src/utils/error-code';
import { MSG_ERR_WHEN_DELETE } from 'src/utils/message.constant';
import { Company } from '../companies/schemas/company.entity';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
    @InjectModel(Company.name)
    private CompanyModel: Model<Company>
  ) { }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async create(createUserDto: CreateUserDto | RegisterUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    // check email
    const existedEmail = await this.UserModel.findOne({
      email: createUserDto.email,
    });
    if (existedEmail) {
      throw new BadRequestException("Email is existed")
    };
    // Check if the company already exists (assuming 'company' is a field in the DTO)
    const existingCompany = await this.CompanyModel.findOne({
      _id: createUserDto.company._id,
    });
    if (!existingCompany) {
      throw new BadRequestException("Company is not existed")
    };
    const createUser = new this.UserModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await createUser.save();
    // Convert to plain JavaScript object
    const userObject = savedUser.toObject();
    delete userObject.password;
    return userObject;
  }

  async findAll() {
    return this.UserModel.find().select("-password");
  }

  async findOne(id: string): Promise<UserDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null
    }
    return this.UserModel.findById(id).select("-password");
  }

  findOneByUserName(username: string) {
    return this.UserModel.findOne({
      email: username
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    return this.UserModel.updateOne({ _id: updateUserDto._id }, updateUserDto);
  }

  async remove(deleteUserDto: DeleteUserDto) {
    try {
      return this.UserModel.updateOne({
        _id: deleteUserDto._id,
      }, { isDeleted: true, deleteddAt: new Date() }
      );
    } catch (error) {
      return buildFailItemResponse(ErrorCode.BAD_REQUEST, MSG_ERR_WHEN_DELETE);
    };
  }

  async isValidPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async updateRefreshToken(_id: string, refresh_token: string) {
    return await this.UserModel.findOneAndUpdate({
      _id
    },
      {
        refresh_token,
        updatedAt: new Date()
      })
  }
}
