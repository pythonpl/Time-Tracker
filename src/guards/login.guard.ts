import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthData } from "../auth/auth.service";

@Injectable()
export class LoginGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = req.headers['authorization']?.split(' ')[1];

        if(!token) {
            throw new BadRequestException();
        }

        try {
            const authData = await this.jwtService.verifyAsync<AuthData>(token);
            req['auth'] = authData;
            return true;
        } catch(e){
            throw new UnauthorizedException();
        }
    }
}