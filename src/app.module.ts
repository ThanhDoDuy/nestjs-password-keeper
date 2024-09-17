import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongodb from './configs/mongose.config';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordsModule } from './modules/passwords/passwords.module';
import { LoggingMiddleware } from './logging/logging.middleware';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { FilesModule } from './modules/files/files.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { MailModule } from './mail/mail.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Ensure correct environment file is loaded
      load: [mongodb],  // Load the MongoDB configuration
    }),
    // Configure MongooseModule to connect to MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('mongodb.uri'); // Fetch MongoDB URI from config
        if (!uri) {
          throw new Error('Missing MongoDB URI in configuration');
        }
        return {
          uri, // Fetch MongoDB URI from config
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5,
    }]),
    PasswordsModule,
    UsersModule,
    AuthModule,
    CompaniesModule,
    // FilesModule,
    RolesModule,
    PermissionsModule,
    MailModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
