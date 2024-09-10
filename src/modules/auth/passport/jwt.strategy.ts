import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/modules/users/user.interface';
import { UsersService } from 'src/modules/users/users.service';
import { RolesService } from 'src/modules/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected  configService: ConfigService,
    private usersService: UsersService,  // Inject UsersService to fetch user data
    private roleService: RolesService,  
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  // Validate the JWT and fetch the user's roles and permissions
  async validate(payload: IUser) {
    const user = await this.usersService.findOne(payload._id);
    // get permissions for users
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // Fetch the role of the user
    const permissions = await this.roleService.findPermissionWithRoleName(user.role);
    return {
      ...payload,
      permissions,  // Add permissions to the user object
    };
  }
}