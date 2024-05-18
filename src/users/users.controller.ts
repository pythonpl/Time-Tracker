import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserDto } from '../users/dto/registerUserDto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { ConfirmEmailDto } from './dto/confirmEmailDto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { RegisterUserResponseDto } from './dto/registerUserResponseDto';

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Serialize(RegisterUserResponseDto)
    createUser(@Body() registerUserDto: RegisterUserDto) {
        return this.usersService.createUser(registerUserDto);
    }

    @Post('/email-confirm')
    @HttpCode(HttpStatus.OK)
    confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
       return this.usersService.confirmEmail(confirmEmailDto);
    }
}
