import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.entity';
import { IUser } from '../users/user.interface';
import { DeleteUserDto } from '../users/dto/update-user.dto';
import { FailItemResponse } from 'src/common/interfaces/fail-item-response.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private CompanyModel: Model<Company>) { }

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const isExsitedName = await this.CompanyModel.countDocuments({
      name: createCompanyDto.name
    });
    if (isExsitedName) {
      throw new ConflictException(`Company with name: "${createCompanyDto.name}" already exists.`);
    }

    const createCompany = new this.CompanyModel({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return createCompany.save();
  }

  async findAll(currentPage: number, limit: number, qs: string, user: IUser) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.CompanyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.CompanyModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .lean()
      .lean().exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại 
        pageSize: limit, //số lượng bản ghi đã lấy 
        pages: totalPages,  //tổng số trang với điều kiện query 
        total: totalItems // tổng số phần tử (số bản ghi) 
      },
      result //kết quả query 
    }
  }

  async findOne(_id: string, user: IUser) {
    return await this.CompanyModel.findOne({
      _id,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    const isExsitedName = this.CompanyModel.countDocuments({
      name: updateCompanyDto?.name
    });
    if (!isExsitedName) {
      throw new ConflictException(`Company with name ${updateCompanyDto.name} already exists.`);
    }
    const updatedCompany = await this.CompanyModel
      .findByIdAndUpdate(id, {
        ...updateCompanyDto, updatedBy: {
          _id: user._id,
          email: user.email
        }
      }, { new: true })
      .lean()
      .lean().exec();
    if (!updatedCompany) {
      throw new NotFoundException(`Password with ID ${id} not found.`);
    }
    return updatedCompany;
  }

  async remove(
    deletePasswordDto: DeleteUserDto,
    user: IUser
  ): Promise<{ _id: string } | FailItemResponse> {
    const updatedCompany = await this.CompanyModel
      .findByIdAndUpdate(deletePasswordDto._id, {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }, { new: true })
      .lean()
      .lean().exec();
    if (!updatedCompany) {
      throw new NotFoundException(`Password with ID ${deletePasswordDto._id} not found.`);
    }
    return { _id: deletePasswordDto._id }
  }
}
