import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    const request = context.switchToHttp().getRequest();

    try {
      const token = this.getToken(request);
      this.jwtService.verify(token);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  getToken(request: { headers: Record<string, string | string[]> }): string {
    const authorization = request.headers['authorization'];

    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }

    const [_, token] = authorization.split(' ');
    return token;
  }
}
