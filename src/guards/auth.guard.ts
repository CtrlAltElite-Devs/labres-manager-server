/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from './application-requests';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { JwtUserPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { EntityManager } from '@mikro-orm/core';
import { User } from 'src/entities/user.entity';
import { Admin } from 'src/entities/admin.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly em: EntityManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer')) {
      this.logger.log('No Bearer token provided');
      throw new UnauthorizedException();
    }

    const token = authorization?.split(' ')[1];

    if (!token) {
      this.logger.log('No token provided');
      throw new UnauthorizedException();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      this.logger.log(`decoded jwt is ${decoded}`);
      const decodedPayload = decoded as JwtUserPayloadDto;
      this.logger.log(`decoded payload is ${JSON.stringify(decodedPayload)}`);

      if (decodedPayload.isAdmin) {
        // find admin
        const admin = await this.em.findOne(Admin, {
            id: decodedPayload.adminId
        })

        if(admin === null){
          this.logger.log('Admin was not found');  
          throw new UnauthorizedException('Invalid token');
        }
        request.admin = admin;
        
      } else {
        // find user
        const user = await this.em.findOne(User, {
          pid: decodedPayload.pid,
        });

        if (user === null) {
          this.logger.log('User was not found');
          throw new UnauthorizedException('Invalid token');
        }

        request.user = user;
      }

      return true;
    } catch {
      this.logger.log('Decoding failed');
      throw new UnauthorizedException('A decoding exception occured');
    }
  }
}
