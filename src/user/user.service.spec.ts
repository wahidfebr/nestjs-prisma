import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

type MockPrismaUser = {
  findUnique: jest.Mock;
  create: jest.Mock;
};

type MockPrismaClient = {
  user: MockPrismaUser;
};

jest.mock('../../generated/prisma', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    })),
  };
});

describe('UserService', () => {
  let service: UserService;
  let prismaClient: MockPrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaClient = (service as unknown as { prisma: MockPrismaClient }).prisma;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmail should call prisma.user.findUnique', async () => {
    prismaClient.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com' });
    const result = await service.findByEmail('a@b.com');
    expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'a@b.com' },
    });
    expect(result).toEqual({ id: 1, email: 'a@b.com' });
  });

  it('createUser should call prisma.user.create', async () => {
    prismaClient.user.create.mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      password: 'pw',
      name: 'A',
    });
    const result = await service.createUser('a@b.com', 'pw', 'A');
    expect(prismaClient.user.create).toHaveBeenCalledWith({
      data: { email: 'a@b.com', password: 'pw', name: 'A' },
    });
    expect(result).toEqual({
      id: 1,
      email: 'a@b.com',
      password: 'pw',
      name: 'A',
    });
  });
});
