import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from 'src/modules/permissions/permissions.service';
import { RolesService } from 'src/modules/roles/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RolesService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.permissions) {
      return false;
    }
    // Check if the user has all the required permissions
    const hasPermission = requiredPermissions.every(
      permission => user.permissions.includes(permission));
    if (!hasPermission) {
      // Throw a custom ForbiddenException with a custom message
      throw new ForbiddenException(
        'You do not have the necessary permissions to access this resource.');
    }

    return true;
  }
}
