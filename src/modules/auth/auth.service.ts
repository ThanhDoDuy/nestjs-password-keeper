import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/user.interface';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { REFRESH_TOKEN } from 'src/common/constant/default.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }
  // username and password are 2 return parameters from Passport library
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (!user) return null;
    const isValidPassword = await this.usersService.isValidPassword(pass, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: IUser, response: Response) {
    const { _id, email, name, role } = user;
    const payload = {
      sub: 'Token login',
      iss: 'From server',
      _id,
      email,
      name,
      role,
    };
    const refreshToken = this.createRefreshToken(payload);
    // update user with refresh token
    await this.usersService.updateRefreshToken(_id, refreshToken);
    // Set cookie for refresh token
    response.clearCookie(REFRESH_TOKEN)
    response.cookie(REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRED')),
    })
    // access token will be used for authorization, and refresh token will be used for refreshing token when it expires.
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        email,
        name,
        role,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    return await this.usersService.create(registerUserDto);
  }

  createRefreshToken = (payload: any) => {
    if (payload?.exp) delete payload.exp;
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRED'))
    });
  }
  
  processNewPairToken = async (refresh_token: string, response: Response) => {
    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      if (!payload) {
        throw new Error('Invalid refresh token')
      };
      // verify with refresh token in database
      const user = await this.usersService.findOne(payload._id);
      // create new refresh token
      const newRefreshToken = this.createRefreshToken(payload);
      // update user with new refresh token
      await this.usersService.updateRefreshToken(payload._id , newRefreshToken);
      const newAccessToken = this.jwtService.sign({
        sub: user._id,
        iss: 'From server',
        email: user.email,
        name: user.name,
        role: user.role,
      }, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: ms(this.configService.get<string>('JWT_ACCESS_EXPIRED')),
      });
      // Set cookie for refresh token
      response.clearCookie(REFRESH_TOKEN);
      response.cookie(REFRESH_TOKEN, newRefreshToken, {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRED')),
      });
      return {
        access_token: newAccessToken,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      throw new BadRequestException('Refresh token is invalid or expired')
    }
  }

  logout = async (userId: string, response: Response) => {
    // update user with refresh token equal null
    await this.usersService.updateRefreshToken(userId , null);
    // clear cookie for refresh token
    response.clearCookie(REFRESH_TOKEN);
    return "OK";
  };
}