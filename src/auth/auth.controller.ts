import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthService } from './auth.service';
import { CreateCustomerDto } from 'src/users/dto/create-customer.dto';
import { AuthJwtDto } from './dto/auth-jwt.dto';

@Controller('auth')
export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('login')
  login(@Body() authLoginUserDto: AuthLoginUserDto): Promise<AuthJwtDto> {
    return this.authService.login(authLoginUserDto);
  }

  // Only for customer sign up
  @Post('signup')
  signup(@Body() createCustomerDto: CreateCustomerDto) {
    return this.authService.customerSignup(createCustomerDto);
  }
}
