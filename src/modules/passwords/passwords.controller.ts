import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { CreatePasswordDto, UpdatePasswordDto } from 'src/common/dto/create-password.dto';
import { User } from 'src/decorators/customize.decorator';
import { IUser } from '../users/user.interface';

@Controller('passwords')
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
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  create(@Body() createPasswordDto: CreatePasswordDto, @User() user: IUser) {
    return this.passwordsService.create(createPasswordDto, user);
  }

  @Put()
  update(@Body() updatePasswordDto: UpdatePasswordDto, @User() user: IUser) {
    return this.passwordsService.update(updatePasswordDto, user);
  }

  @Post('/delete')
  remove(@Body() deletePasswordDto: UpdatePasswordDto, @User() user: IUser) {
    return this.passwordsService.remove(deletePasswordDto, user);
  }
}
