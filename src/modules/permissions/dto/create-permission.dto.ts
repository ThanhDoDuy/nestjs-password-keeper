import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  method: string;  // e.g., GET, POST, PUT, DELETE

  @IsString()
  @IsNotEmpty()
  module: string;

  @IsString()
  @IsOptional()
  description?: string;
}
