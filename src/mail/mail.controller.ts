import { Controller, Get } from '@nestjs/common';
import { Public, ResponseMessage } from 'src/decorators/customize.decorator';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }
  @Get('/send-mail')
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    await this.mailService.sendUserWelcome(
      "jenbiminh@gmail.com", 
      'Tai Chim Se', // override default from 
    );
  }
}
