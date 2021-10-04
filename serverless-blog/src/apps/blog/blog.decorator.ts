import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const Authorization = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  try {
    const req = ctx.switchToHttp().getRequest();
    return { user: req.user };
  } catch (ex) {
    throw new UnauthorizedException();
  }
});

export interface AuthUser {
  user: { id: string; }
}
