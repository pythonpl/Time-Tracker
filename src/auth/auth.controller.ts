import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/loginUserDto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto.email, loginUserDto.password);
    }
}
