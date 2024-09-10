import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePasswordDto {
  @IsNotEmpty()
  @IsString()
  AppName: string;  // Matches Mongoose schema field 'AppName'

  @IsNotEmpty()
  @IsString()
  username: string;  // Matches Mongoose schema field 'username'

  @IsNotEmpty()
  @IsString()
  @MinLength(8)  // Example: Minimum length of 8 characters for passwords
  password: string;  // Matches Mongoose schema field 'password'

  @IsOptional()
  @IsString()
  note?: string;  // Matches Mongoose schema field 'note'
}

export class UpdatePasswordDto extends PartialType(CreatePasswordDto) {
  @IsNotEmpty()
  @IsString()
  _id: string;
}
