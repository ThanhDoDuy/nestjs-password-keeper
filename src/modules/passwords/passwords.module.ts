// src/modules/passwords/passwords.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordsService } from './passwords.service';
import { PasswordsController } from './passwords.controller';
import { Password, PasswordSchema } from '../../common/schemas/password.schema';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Password.name, schema: PasswordSchema }]),
    RolesModule
  ],
  controllers: [PasswordsController],
  providers: [PasswordsService],
})
export class PasswordsModule {}
