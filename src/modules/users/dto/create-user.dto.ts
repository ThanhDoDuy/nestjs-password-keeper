import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, Length, ValidateNested } from "class-validator";
import mongoose from "mongoose";

export class Company {
    @IsNotEmpty()
    @IsString()
    @Length(24, 24, { message: '_id must be exactly 24 characters long.' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    name: string;
}

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    address: string;
}

export class RegisterUserDto {
    @IsString()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    phone: string;

    @IsNumber()
    age: number;

    @IsString()
    gender: string;

    @IsString()
    address: string;
}