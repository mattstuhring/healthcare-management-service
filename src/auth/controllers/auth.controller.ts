import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthLoginUserDto } from '../dtos/auth-login-user.dto';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { AuthJwtResponse } from '../models/auth-jwt-response.interface';
import { AuthRefreshTokenDto } from '../dtos/auth-refresh-token.dto';
import { AuthJwtGuard } from '../guards/auth-jwt.guard';
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
  @ApiOkResponse({ description: 'The resource was created successfully' })
  @ApiConflictResponse({ description: 'Duplicate entity' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  signUpCustomer(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpCustomer(createUserDto);
  }

  @Post('login')
  @ApiOkResponse({ description: 'The user was logged in successfully' })
  @ApiNotFoundResponse({ description: 'The resource was not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  login(@Body() authLoginUserDto: AuthLoginUserDto): Promise<AuthJwtResponse> {
    return this.authService.login(authLoginUserDto);
  }

  @Post('logout')
  @ApiOkResponse({ description: 'The user was logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @UseGuards(AuthJwtGuard)
  logout(): Promise<{ message: string }> {
    return this.authService.logout();
  }

  @Post('refresh-token')
  @ApiOkResponse({ description: 'The resource was created successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @UseGuards(AuthJwtGuard)
  refreshToken(
    @Body() authRefreshTokenDto: AuthRefreshTokenDto,
  ): Promise<AuthJwtResponse> {
    return this.authService.refreshToken(authRefreshTokenDto);
  }
}
