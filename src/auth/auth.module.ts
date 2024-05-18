import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../../config';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User]), JwtModule.register({
    global: true,
    secret: JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
