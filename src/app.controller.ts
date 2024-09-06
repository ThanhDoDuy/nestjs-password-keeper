import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { AuthService } from './modules/auth/auth.service';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { Public } from './decorators/customize.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  /**
   * call LocalAuthGuard
   * LocalAuthGuard kế thừa từ AuthGuard('local'), nên nó gọi hàm canActivate(context) từ AuthGuard.
   * canActivate bên trong AuthGuard sẽ gọi passport.authenticate('local')
   * passport.authenticate('local') sẽ khởi chạy chiến lược-strategy local
   * passport-local sẽ gọi phương thức validate() của chiến lược LocalStrategy (đã được định nghĩa trong ứng dụng của bạn).
   * Phương thức validateUser trong AuthService sẽ kiểm tra xem thông tin người dùng có hợp lệ không.
   * 
   * @UseGuards(LocalAuthGuard) -> AuthGuard('local').canActivate(context)
   * AuthGuard('local').canActivate(context) -> passport.authenticate('local')
   * passport.authenticate('local') -> LocalStrategy.validate(username, password)
   * LocalStrategy.validate(username, password) -> AuthService.validateUser(username, password)
   * AuthService.validateUser(username, password) -> Trả về user hoặc null
   * Nếu thành công: LocalStrategy.validate() -> Trả về user -> Controller's login function
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
