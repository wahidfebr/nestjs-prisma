import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller({ path: 'user', version: '1.0' })
export class UserController {
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
