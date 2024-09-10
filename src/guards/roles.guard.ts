import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { RolesService } from 'src/modules/roles/roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private roleService: RolesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required for the route
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    const role = await this.roleService.findByName(user.role);
    if (!role) {
      return false;
    }

    return requiredRoles.includes(role.name);
  }
}
