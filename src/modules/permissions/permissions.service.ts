import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { Model } from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>
  ) { }

  async create(permissionDto: CreatePermissionDto): Promise<Permission> {
    const createUser = new this.permissionModel({
      ...permissionDto,
    });
    return await createUser.save();
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.permissionModel.findOne({ name }).lean().exec();
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.find().lean().exec();
  }

  async update(id: string, updateData: any): Promise<Permission | null> {
    return this.permissionModel.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
  }

  async delete(id: string): Promise<any> {
    return this.permissionModel.findByIdAndDelete(id).lean().exec();
  }
}
