import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { CreatePasswordDto, UpdatePasswordDto } from 'src/common/dto/create-password.dto';

@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Get()
  findAll() {
    return this.passwordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordsService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  create(@Body() createPasswordDto: CreatePasswordDto) {
    return this.passwordsService.create(createPasswordDto);
  }

  @Put()
  update(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.passwordsService.update(updatePasswordDto);
  }

  @Post('/delete')
  remove(@Body() deletePasswordDto: UpdatePasswordDto) {
    return this.passwordsService.remove(deletePasswordDto);
  }
}
