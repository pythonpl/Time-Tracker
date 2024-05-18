import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { hashString } from '../utils/crypto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../entities/user.entity';

export interface AuthData {
    id: number,
    email: string,
    roleType: UserRole,
}

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService, private usersService: UsersService) {}

    async login(email: string, pass: string) {
        const user = await this.usersService.findUserByEmail(email);

        if (!user || hashString(pass) !== user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.emailConfirmToken) {
            throw new UnauthorizedException('You have to confirm your email first');
        }

        const token = await this.jwtService.signAsync({ id: user.id, email: user.email, roleType: user.roleType });
        return { token };
    }

}
