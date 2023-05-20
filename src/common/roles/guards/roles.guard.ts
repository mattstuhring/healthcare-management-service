import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthAccessTokenPayload } from '../../../auth/models/auth-access-token-payload.interface';
import { RoleName } from '../constants/role.enum';

/**
 * RBAC Guard for authorization by role
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private reflector: Reflector;
  private jwtService: JwtService;

  constructor(reflector: Reflector, jwtService: JwtService) {
    this.reflector = reflector;
    this.jwtService = jwtService;
  }

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | boolean | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();

      // Get Roles metadata from request
      const roles = this.reflector.get<string[]>('roles', context.getHandler());

      // Public API
      if (!roles) {
        return true;
      }

      // Check if user is authorized
      const token = this.getToken(request);
      const isAuthorized = this.authorizer(token, roles);
      console.log('authorized: ' + isAuthorized);

      return isAuthorized;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // Perform authorization
  authorizer(token: string, roles: string[]): boolean {
    const user = this.jwtService.decode(token) as AuthAccessTokenPayload;

    // SUPER ADMIN has permission to all resources & actions
    if (user.role.name === RoleName.SUPER_ADMIN) {
      return true;
    }

    return roles.includes(user.role.name);
  }

  // Extract Bearer token from request headers
  getToken(request: Request): string {
    const authorization = request.headers['authorization'];

    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }

    const [_, token] = authorization.split(' ');
    return token;
  }
}
