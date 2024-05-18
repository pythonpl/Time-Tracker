import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashString } from '../utils/crypto';
import { BadRequestException } from '@nestjs/common';
import { MockType, repositoryMockFactory } from '../mocks';

describe('UsersService', () => {
  let service: UsersService;
  let repoMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repoMock = module.get(getRepositoryToken(User));
  });

  it('Service and mock should be defined', () => {
    expect(service).toBeDefined();
    expect(repoMock).toBeDefined();
  });

  it('Should create user', async () => {
    const user = await service.createUser({email: 'a@a.pl', password: 'pass'});

    expect(user.email).toEqual('a@a.pl');
    expect(user.password).toEqual(hashString('pass'));
    expect(user.emailConfirmToken).not.toBeNull();
  });

  it('Should find user', async () => {
    repoMock.findOne.mockReturnValue({email: 'a@a.pl', password: hashString('pass')});

    const user = await service.findUserByEmail('a@a.pl');

    expect(user.email).toEqual('a@a.pl');
    expect(user.password).toEqual(hashString('pass'));
  });

  it('Should fail to confirm email (already confirmed)', async () => {
    repoMock.findOne.mockReturnValue({email: 'a@a.pl', password: hashString('pass'), emailConfirmToken: null});
    await expect(service.confirmEmail({email: 'a@a.pl', emailConfirmToken: 'xxx'})).rejects.toThrow(BadRequestException);
  });

  it('Should fail to confirm email (invalid token)', async () => {
    repoMock.findOne.mockReturnValue({email: 'a@a.pl', password: hashString('pass'), emailConfirmToken: 'xxxx'});
    await expect(service.confirmEmail({email: 'a@a.pl', emailConfirmToken: 'xxx'})).rejects.toThrow(BadRequestException);
  });

  it('Should confirm email', async () => {
    repoMock.findOne.mockReturnValue({email: 'a@a.pl', password: hashString('pass'), emailConfirmToken: 'xxx'});
    repoMock.update.mockReturnValue({email: 'a@a.pl', password: hashString('pass'), emailConfirmToken: null});
    await expect(service.confirmEmail({email: 'a@a.pl', emailConfirmToken: 'xxx'})).resolves.not.toThrow();
  });
});
