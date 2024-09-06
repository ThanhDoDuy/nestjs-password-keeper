import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}

export class DeleteCompanyDto {
    @IsString()
    @IsNotEmpty()
    _id: string;
}