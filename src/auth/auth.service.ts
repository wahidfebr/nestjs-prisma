import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginSchema, RegisterSchema } from './auth.validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: unknown) {
    const validatedData = RegisterSchema.parse(data);
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    const user = await this.userService.createUser({
      ...validatedData,
      password: hashedPassword,
    });
    return { id: user.id, email: user.email, name: user.name };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(data: unknown) {
    const validatedData = LoginSchema.parse(data);
    const user = await this.validateUser(
      validatedData.email,
      validatedData.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateJwtPayload(payload: { sub: number; email: string }) {
    return this.userService.findByEmail(payload.email);
  }
}
