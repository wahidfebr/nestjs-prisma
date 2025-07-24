import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            createUser: () => ({}),
            findByEmail: () => ({}),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => 'signed-jwt',
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('registers a user and returns public fields', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    const mockCreateUser = jest.fn().mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      name: 'A',
      password: 'hashed',
    });
    userService.createUser = mockCreateUser;
    const result = await service.register('a@b.com', 'pw', 'A');
    expect(result).toEqual({ id: 1, email: 'a@b.com', name: 'A' });
    expect(bcrypt.hash).toHaveBeenCalledWith('pw', 10);
    expect(mockCreateUser).toHaveBeenCalledWith('a@b.com', 'hashed', 'A');
  });

  it('validates user with correct password', async () => {
    const mockFindByEmail = jest
      .fn()
      .mockResolvedValue({ email: 'a@b.com', password: 'hashed' });
    userService.findByEmail = mockFindByEmail;
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const user = await service.validateUser('a@b.com', 'pw');
    expect(user).toBeTruthy();
    expect(mockFindByEmail).toHaveBeenCalledWith('a@b.com');
  });

  it('returns null for invalid user or password', async () => {
    const mockFindByEmail = jest.fn().mockResolvedValue(null);
    userService.findByEmail = mockFindByEmail;
    expect(await service.validateUser('a@b.com', 'pw')).toBeNull();
    expect(mockFindByEmail).toHaveBeenCalledWith('a@b.com');
    const mockFindByEmail2 = jest
      .fn()
      .mockResolvedValue({ email: 'a@b.com', password: 'hashed' });
    userService.findByEmail = mockFindByEmail2;
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    expect(await service.validateUser('a@b.com', 'pw')).toBeNull();
    expect(mockFindByEmail2).toHaveBeenCalledWith('a@b.com');
  });

  it('logs in and returns access_token', async () => {
    const mockValidateUser = jest.fn().mockImplementation(() => ({
      id: 1,
      email: 'a@b.com',
      password: 'hashed',
      name: null,
      createdAt: new Date(),
    }));
    service.validateUser = mockValidateUser;
    const result = await service.login('a@b.com', 'pw');
    expect(result).toEqual({ access_token: 'signed-jwt' });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: 1, email: 'a@b.com' });
    expect(mockValidateUser).toHaveBeenCalledWith('a@b.com', 'pw');
  });

  it('throws UnauthorizedException on login failure', async () => {
    const mockValidateUser = jest.fn().mockImplementation(() => null);
    service.validateUser = mockValidateUser;
    await expect(service.login('a@b.com', 'pw')).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockValidateUser).toHaveBeenCalledWith('a@b.com', 'pw');
  });

  it('validateJwtPayload returns user', async () => {
    const mockFindByEmail = jest
      .fn()
      .mockResolvedValue({ id: 1, email: 'a@b.com', name: 'A' });
    userService.findByEmail = mockFindByEmail;
    const result = await service.validateJwtPayload({
      sub: 1,
      email: 'a@b.com',
    });
    expect(result).toEqual({ id: 1, email: 'a@b.com', name: 'A' });
    expect(mockFindByEmail).toHaveBeenCalledWith('a@b.com');
  });
});
