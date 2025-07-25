import { Controller, Post, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { Request } from 'express';

@Controller({ path: 'auth', version: '1.0' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Req() req: Request) {
    return this.authService.register(req.body);
  }

  @Public()
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.body);
  }

  @Public()
  @Get('health')
  health() {
    return 'ok';
  }
}
