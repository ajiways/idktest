import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayloadWithRefreshToken } from '../../modules/administration/auth/types';

export const GetUser = createParamDecorator(
  (data: keyof UserPayloadWithRefreshToken | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
