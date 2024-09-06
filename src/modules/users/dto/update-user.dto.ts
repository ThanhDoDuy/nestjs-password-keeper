import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {
    @IsNotEmpty()
    @IsString()
    id: string;
}

export class DeleteUserDto {
    @IsNotEmpty()
    @IsString()
    id: string;
}