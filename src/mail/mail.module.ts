import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({ 
      useFactory: async (configService: ConfigService) => ({ 
        transport: { 
          host: 'smtp.gmail.com', 
          secure: false, 
          auth: { 
             user: configService.get<string>('MAIL_USER'), //'user@example.com'
             pass: configService.get<string>('MAIL_PASSWORD_SECRET'), //'topsecret', 
          }, 
        }, 
        template: { 
          dir: join(__dirname, 'templates'), 
          adapter: new HandlebarsAdapter(), 
          options: { 
            strict: true, 
          }, 
        }, 
      }), 
      inject: [ConfigService], 
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
