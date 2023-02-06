import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthJwtResponse } from './constants/auth-jwt-response.interface';
import { AuthRefreshTokenDto } from './dto/auth-refresh-token.dto';
import { AuthJwtGuard } from './auth-jwt.guard';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('signup')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiConflictResponse({ description: 'Duplicate entity' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  login(@Body() authLoginUserDto: AuthLoginUserDto): Promise<AuthJwtResponse> {
    return this.authService.login(authLoginUserDto);
  }

  @Post('logout')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @UseGuards(AuthJwtGuard)
  logout(): Promise<{ message: string }> {
    return this.authService.logout();
  }

  @Post('refresh-token')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  refreshToken(
    @Body() authRefreshTokenDto: AuthRefreshTokenDto,
  ): Promise<AuthJwtResponse> {
    return this.authService.refreshToken(authRefreshTokenDto);
  }
}
