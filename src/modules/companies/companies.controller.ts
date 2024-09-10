import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ResponseMessage, User } from 'src/decorators/customize.decorator';
import { IUser } from '../users/user.interface';
import { DeleteUserDto } from '../users/dto/update-user.dto';
import { query } from 'express';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage('Create new company')
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
    @User() user: IUser
  ) {
    return this.companiesService.findAll(+currentPage, +limit, qs, user);
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string, @User() user: IUser) {
    return this.companiesService.findOne(_id, user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser)
  {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Post('delete')
  remove(@Body() deleteUserDto: DeleteUserDto,  @User() user: IUser) {
    return this.companiesService.remove(deleteUserDto, user);
  }
}
