import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthJwtGuard implements CanActivate {
  private jwtService: JwtService;

  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();

      // Initiate client authentication
      const token = this.getToken(request);
      this.verifyToken(token);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // Perform token authentication
  verifyToken(token: string) {
    this.jwtService.verify(token);
    console.log('authenticated: true');
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
