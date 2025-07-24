import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UserService, JwtService],
    })
      .overrideProvider(AuthService)
      .useValue({
        register: () => ({ id: 1, email: 'a@b.com', name: 'A' }),
        login: () => ({ access_token: 'token' }),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register should call AuthService.register and return result', async () => {
    const body = { email: 'a@b.com', password: 'pw', name: 'A' };
    const spy = jest.spyOn(authService, 'register');
    const result = await controller.register(body);
    expect(spy).toHaveBeenCalledWith('a@b.com', 'pw', 'A');
    expect(result).toEqual({ id: 1, email: 'a@b.com', name: 'A' });
  });

  it('login should call AuthService.login and return result', async () => {
    const body = { email: 'a@b.com', password: 'pw' };
    const spy = jest.spyOn(authService, 'login');
    const result = await controller.login(body);
    expect(spy).toHaveBeenCalledWith('a@b.com', 'pw');
    expect(result).toEqual({ access_token: 'token' });
  });
});
