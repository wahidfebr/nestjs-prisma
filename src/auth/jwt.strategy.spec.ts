import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: Partial<AuthService>;

  beforeEach(() => {
    authService = {
      validateJwtPayload: () => ({}),
    };
    strategy = new JwtStrategy(authService as AuthService);
  });

  it('should return user if found', async () => {
    authService.validateJwtPayload = () => ({
      id: 1,
      email: 'a@b.com',
      name: 'A',
    });
    const result = await strategy.validate({ sub: 1, email: 'a@b.com' });
    expect(result).toEqual({ id: 1, email: 'a@b.com', name: 'A' });
    expect(typeof authService.validateJwtPayload).toBe('function');
  });

  it('should return null if user not found', async () => {
    authService.validateJwtPayload = () => null;
    const result = await strategy.validate({ sub: 1, email: 'a@b.com' });
    expect(result).toBeNull();
  });
});
