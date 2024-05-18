import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthData } from '../auth/auth.service';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthData => {
    const request = ctx.switchToHttp().getRequest();
    return request.auth;
  },
);