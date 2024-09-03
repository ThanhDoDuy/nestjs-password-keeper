import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import cfgMongoDB from '../../configs/mongose.config';
import { DatabaseUtilitiesService } from './database-utilities.service';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(cfgMongoDB)],
      useFactory: async (configService: ConfigService) => await configService.get('mongodb'),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseUtilitiesService],
  exports: [DatabaseUtilitiesService]
})

export class DatabaseModule {}