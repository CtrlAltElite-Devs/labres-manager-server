import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER) 
    private cacheManager: Cache
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
    await this.cacheManager.del(pid);

    return user;
  }

  async GetUserById(pid: string) {
    const userCache = await this.cacheManager.get<User>(pid);
    if(userCache){
      this.logger.log(`Found user cache: ${pid}`);
      return userCache;
    }
    const user = await this.userRepository.findOne({pid});
    this.logger.log(`Setting user cache: ${pid}`);
    await this.cacheManager.set(pid, user, 1000);
    return user;
  }
}
