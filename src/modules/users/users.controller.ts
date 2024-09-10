import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto, UpdateUserDto } from './dto/update-user.dto';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { PostPermissions, UserPermissions } from 'src/common/constant/permissions.enum';
import { SetPermissions } from 'src/decorators/permissions.decorator';

@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @SetPermissions(UserPermissions.CREATE_USER) 
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @SetPermissions(UserPermissions.READ_ALL_USER) 
  @SetPermissions(PostPermissions.CREATE_POST) 
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.READ_USER) 
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put()
  @SetPermissions(UserPermissions.EDIT_USER) 
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Post('/delete')
  @SetPermissions(UserPermissions.DELETE_USER) 
  remove(@Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.remove(deleteUserDto);
  }
}
