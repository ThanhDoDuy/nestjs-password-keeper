import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(roleDto: any): Promise<Role> {
    // Check if the role already exists
    const isExsitedRole = await this.roleModel.countDocuments({ name: roleDto.name });
    if (isExsitedRole) {
      throw new ConflictException(`Role with name: "${roleDto.name}" already exists.`);
    }
    // Create the new role and save it to the database
    const createdRole = new this.roleModel(roleDto);
    return createdRole.save();
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).lean().exec();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().lean().exec();
  }

  async update(id: string, updateData: any): Promise<Role | null> {
    return this.roleModel.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
  }

  async delete(id: string): Promise<any> {
    return this.roleModel.findByIdAndDelete(id).lean().exec();
  }

  async findPermissionWithRoleName(name: string): Promise<string[] | null> {
    // Find the role by its _id and populate the 'permissions' field
    const role = await this.roleModel
      .findOne({ name})
      .populate('permissions')  // Populate full Permission objects
      .lean().exec();
  
    if (!role || !role.permissions) {
      return null;
    }

    // Extract and return just the names of the permissions
    return role.permissions.map((permission: any) => permission.name);
  }
}
