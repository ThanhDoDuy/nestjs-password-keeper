import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { CreatePasswordDto, UpdatePasswordDto } from 'src/common/dto/create-password.dto';
import { User } from 'src/decorators/customize.decorator';
import { IUser } from '../users/user.interface';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { SetPermissions } from 'src/decorators/permissions.decorator';
import { PasswordPermissions } from 'src/common/constant/permissions.enum';

@Controller('passwords')
@UseGuards(PermissionsGuard)
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Get()
  findAll(@User() user: IUser) {
    return this.passwordsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: IUser) {
    return this.passwordsService.findOne(id, user);
  }

  @Post()
  @SetPermissions(PasswordPermissions.CREATE_PASSWORD) 
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  create(@Body() createPasswordDto: CreatePasswordDto, @User() user: IUser) {
    return this.passwordsService.create(createPasswordDto, user);
  }

  @Put()
  @SetPermissions(PasswordPermissions.EDIT_PASSWORD) 
  update(@Body() updatePasswordDto: UpdatePasswordDto, @User() user: IUser) {
    return this.passwordsService.update(updatePasswordDto, user);
  }

  @Post('/delete')
  @SetPermissions(PasswordPermissions.DELETE_PASSWORD)
  remove(@Body() deletePasswordDto: UpdatePasswordDto, @User() user: IUser) {
    return this.passwordsService.remove(deletePasswordDto, user);
  }

  @Post('/delete/permanently')
  @SetPermissions(PasswordPermissions.DELETE_PASSWORD_PERMANENTLY)
  delete(@Body() deletePasswordDto: UpdatePasswordDto, @User() user: IUser) {
    return this.passwordsService.delete(deletePasswordDto, user);
  }
}
