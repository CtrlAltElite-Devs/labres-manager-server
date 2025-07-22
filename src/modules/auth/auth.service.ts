/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import { provideToken } from 'src/utils/jwt-utils';
import { LoginResponseDto } from './dto/login-response.dto';
import { CheckPidResponseDto } from './dto/check-pid-response.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtUserPayloadDto } from '../../utils/jwt-payload.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async Login(dto: LoginDto): Promise<LoginResponseDto> {
    const existingUser = await this.userRepository.findOne({
      pid: dto.pid,
    });

    if (existingUser === null) {
      throw new NotFoundException("User doesn't exist");
    }

    if (!existingUser.password) {
      throw new BadRequestException('User needs to onboarding to set password');
    }

    const isMatch = await bcrypt.compare(dto.password, existingUser.password);

    if (!isMatch) {
      throw new ForbiddenException('Invalid Credentials');
    }

    const token = provideToken(JwtUserPayloadDto.MapUser(existingUser));

    return {
      user: existingUser,
      token,
    };
  }

  async CheckPid(pid: string) {
    const existingUser = await this.userRepository.findOne({
      pid: pid,
    });

    if (existingUser === null) {
      return CheckPidResponseDto.NotFoundPid(pid);
    }

    if (!existingUser.password) {
      return CheckPidResponseDto.NoPassword(pid);
    }

    return CheckPidResponseDto.HasPidAndPassword(pid);
  }

  async UpdatePassword(dto: UpdatePasswordDto) : Promise<User>{
    const {pid, password} = dto;

    const user = await this.userRepository.findOne({pid: pid});

    if(user === null) throw new NotFoundException("User not found");

    user.password = await bcrypt.hash(password, 10);

    await this.entityManager.flush();

    return user;
  }

}
