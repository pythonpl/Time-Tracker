import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { hashString } from '../utils/crypto';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET } from '../../config';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [
      {
        id: 1,
        email: 'test@test.pl',
        password: hashString('pass'),
        roleType: 'USER',
        emailConfirmToken: 'XXX'
      } as User,
      {
        id: 2,
        email: 'test2@test.pl',
        password: hashString('pass'),
        roleType: 'USER',
        emailConfirmToken: null
      } as User
    ];

    fakeUsersService = {
      findUserByEmail: (email: string) => {
        const user = users.find((user) => user.email === email);
        return Promise.resolve(user);
      }
    }

    const module = await Test.createTestingModule({
      imports: [JwtModule.register({
        global: true,
        secret: JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      })],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should throw UnauthorizedException (email not confirmed)', async () => {
    await expect(service.login('test@test.pl', 'pass')).rejects.toThrow(UnauthorizedException);
  });

  it('Should throw UnauthorizedException (bad credentials)', async () => {
    await expect(service.login('test@test.pl', 'passsss')).rejects.toThrow(UnauthorizedException);
  });

  it('Should return JWT', async () => {
    const response = await service.login('test2@test.pl', 'pass');

    expect(response).toBeDefined();
    expect(response.token).toBeDefined();
  });
});
