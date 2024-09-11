import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}
	async sendUserWelcome( toUserEmail: string, toName: string ) {
		await this.mailerService.sendMail({
			from: "duythanh1602@gmail.com",
			to: toUserEmail,  // The recipient's email address
			subject: 'Welcome to Our App!',  // Subject of the email
			template: './welcome.template.hbs',  // Path to the Handlebars template (without extension)
			context: {  // Data passed to the template
				name: toName,
			},
		})
		.then(() => console.log("Successfully sending"))
		.catch(error => console.error(error));
	}
}
