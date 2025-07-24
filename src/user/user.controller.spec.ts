import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Request } from 'express';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getProfile should return req.user', () => {
    const req = { user: { id: 1, email: 'a@b.com' } } as unknown as Request;
    expect(controller.getProfile(req)).toEqual({ id: 1, email: 'a@b.com' });
  });
});
