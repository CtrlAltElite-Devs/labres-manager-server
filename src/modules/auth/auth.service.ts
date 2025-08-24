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
import { UserDto } from './dto/user.dto';
import { UserCacheKey } from 'src/helpers/cache-helpers/user.cache';
import { LoginResponseV2Dto, UserDtoV2 } from './dto/login-response-v2.dto';


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
      throw new BadRequestException('User needs to be onboarded to set password');
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

  async LoginV2(dto: LoginDto) : Promise<LoginResponseV2Dto> {
    const existingUser = await this.userRepository.findOne({
      pid: dto.pid,
    });

    if (existingUser === null) {
      throw new NotFoundException("User doesn't exist");
    }

    if (!existingUser.password) {
      throw new BadRequestException('User needs to be onboarded to set password');
    }

    const isMatch = await bcrypt.compare(dto.password, existingUser.password);

    if (!isMatch) {
      throw new ForbiddenException('Invalid Credentials');
    }

    const token = provideToken(JwtUserPayloadDto.MapUser(existingUser));

    const userDto = new UserDtoV2();
    userDto.pid = existingUser.pid;
    userDto.dob = existingUser.dob;
    userDto.createdAt = existingUser.createdAt;

    const response = new LoginResponseV2Dto();
    response.token = token;
    response.user = userDto;
    return response;
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
    await this.invokeCacheSideEffect(dto.pid);

    return user;
  }

  async GetUserById(pid: string) {
    return await this.userRepository.findOne({pid});
  }

  async GetUserByIdForGuard(pid: string){
    const userDtoCache = await this.cacheManager.get<UserDto>(UserCacheKey(pid));
    if(userDtoCache){
      this.logger.log(`User cache hit: ${pid}`)
      return userDtoCache;
    }
    const userDto = await this.userRepository.findOne({pid}, {
      fields: ["pid"]
    })
    this.logger.log(`User cache miss: ${pid}`);
    await this.cacheManager.set(UserCacheKey(pid), userDto, 1000*10);
    return userDto
  }

  private async invokeCacheSideEffect(pid: string) {
    await this.cacheManager.del(UserCacheKey(pid));
  }
}
