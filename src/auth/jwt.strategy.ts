import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecretkey', // Use env in production
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.authService.validateJwtPayload(payload);
    if (!user) {
      return null;
    }
    // Attach user to request
    return { id: user.id, email: user.email, name: user.name };
  }
}
