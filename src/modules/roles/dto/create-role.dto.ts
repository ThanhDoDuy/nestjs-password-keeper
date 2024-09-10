import { IsString, IsNotEmpty, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  permissions: string[] = [];

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;

  @IsBoolean()
  @IsOptional()
  isDeleted: boolean = false;
}
