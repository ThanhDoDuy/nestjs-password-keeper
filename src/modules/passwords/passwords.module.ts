// src/modules/passwords/passwords.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordsService } from './passwords.service';
import { PasswordsController } from './passwords.controller';
import { Password, PasswordSchema } from '../../common/schemas/password.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Password.name, schema: PasswordSchema }]),
  ],
  controllers: [PasswordsController],
  providers: [PasswordsService],
})
export class PasswordsModule {}
