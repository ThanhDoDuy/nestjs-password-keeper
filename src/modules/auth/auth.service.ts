import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }
  // username and password are 2 return parameters from Passport library
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (!user) return null;
    const isValidPassword = await this.usersService.isValidPassword(pass, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: IUser) {
    const { _id, email, name, role } = user;
    console.log(user)
    const payload = {
      sub: 'Token login',
      iss: 'From server',
      _id,
      email,
      name,
      role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}