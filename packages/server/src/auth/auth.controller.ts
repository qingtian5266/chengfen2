import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: any) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('wechatLogin')
  async wechatLogin(@Body() dto: any) {
    return this.authService.wechatLogin(dto);
  }
}
