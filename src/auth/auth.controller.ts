import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthJwtResponse } from './constants/auth-jwt-response.interface';
import { AuthRefreshTokenDto } from './dto/auth-refresh-token.dto';

@Controller('auth')
export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  login(@Body() authLoginUserDto: AuthLoginUserDto): Promise<AuthJwtResponse> {
    return this.authService.login(authLoginUserDto);
  }

  @Post('refresh-token')
  refreshToken(
    @Body() authRefreshTokenDto: AuthRefreshTokenDto,
  ): Promise<AuthJwtResponse> {
    return this.authService.refreshToken(authRefreshTokenDto);
  }
}
