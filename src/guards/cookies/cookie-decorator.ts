
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request : Request = ctx.switchToHttp().getRequest();
  return request.cookies[data] as string;
});
