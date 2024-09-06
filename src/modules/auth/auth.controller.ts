import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/customize.decorator';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }
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
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
