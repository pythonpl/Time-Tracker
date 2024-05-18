import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/registerUserDto';
import { ConfirmEmailDto } from './dto/confirmEmailDto';
import { hashString, randomString } from '../utils/crypto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ){}

    findUserByEmail(email: string) {
        return this.repository.findOne({ where: { email } });
    }

    private async updateUser(id: number, updateAttributes: Partial<User>) {
        const user = await this.repository.findOne({ where: { id } });

        if (!user) {
          throw new NotFoundException();
        }

        Object.assign(user, updateAttributes);
        return this.repository.save(user);
    }

    async createUser(props: RegisterUserDto) {
        const entity = this.repository.create({ 
            email: props.email, 
            password: hashString(props.password), 
            emailConfirmToken: randomString()
        });
        return this.repository.save(entity);
    }
    
    async confirmEmail(props: ConfirmEmailDto) {
        const user = await this.findUserByEmail(props.email);

        if(!user || !user.emailConfirmToken) {
            throw new BadRequestException('Email already confirmed')
        }

        if(user.emailConfirmToken !== props.emailConfirmToken) {
            throw new BadRequestException('Invalid token')
        }

        await this.updateUser(user.id, { emailConfirmToken: null });
    }

}
