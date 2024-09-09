import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorators/customize.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { Request, Response } from 'express';
import { REFRESH_TOKEN } from 'src/common/constant/default.schema';
import { IUser } from '../users/user.interface';

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
  @ResponseMessage('User login')
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('User Register')
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('account')
  @ResponseMessage('User get Info')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('logout')
  @ResponseMessage('User log out')
  logout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser
  ) {
    return this.authService.logout(user._id, response);;
  }

  @Public()
  @Get('refresh')
  @ResponseMessage('User get Refresh Token')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response) {
    const refresh_token = request.cookies?.[REFRESH_TOKEN];
    if (!refresh_token) throw new BadRequestException('Some error happened, Please login again.');
    return this.authService.processNewPairToken(refresh_token, response);
  }
}
