import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('signin')
  signIn(
    @Body() authLoginUserDto: AuthLoginUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authLoginUserDto);
  }
}
