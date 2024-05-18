import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        console.log(req)
        return req.auth.roleType === 'ADMIN';
    }
}