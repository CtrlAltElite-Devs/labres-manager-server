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
import { CheckPidResponseDto } from './dto/check-pid-response.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtUserPayloadDto } from '../../utils/jwt-payload.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserDto } from './dto/user.dto';
import { UserCacheKey } from 'src/helpers/cache-helpers/user.cache';
import { LoginResponseV2Dto } from './dto/login/login-response-v2.dto';
import { LoginResponseDto } from './dto/login/login-response.dto';
import { CustomJwtService } from '../common/custom-jwt-service';
import { RefreshTokenService } from '../common/refresh-token-service';
import { RequestMetadata } from 'src/security/common/metadata-request';
import { RefreshTokenResponseDto } from './dto/refresh-token/refresh-token-response.dto';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER) 
    private cacheManager: Cache,
    private readonly jwtService: CustomJwtService,
    private readonly refreshTokenService: RefreshTokenService
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

    const payload = JwtUserPayloadDto.MapUser(existingUser);
    const { token } = await this.jwtService.CreateSignedTokens(payload);

    return {
      user: existingUser,
      token,
    };
  }

  async LoginV2(dto: LoginDto, metaData: RequestMetadata) : Promise<LoginResponseV2Dto> {
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

    const payload = JwtUserPayloadDto.MapUser(existingUser);
    const { token, refreshToken } = await this.jwtService.CreateSignedTokens(payload);
    await this.refreshTokenService.Store(existingUser.pid, refreshToken, metaData);

    const response = LoginResponseV2Dto.Map(existingUser, token, refreshToken);

    return response;
  }

  //todo common ni sya sa admin service maybe
  async Refresh(refreshToken: string, metaData: RequestMetadata) : Promise<RefreshTokenResponseDto>{
    const { userId, newToken, newRefreshToken } = await this.refreshTokenService.RemoveAndReturnNewTokens(refreshToken, metaData);
    await this.refreshTokenService.Store(userId!, newRefreshToken, metaData);
    
    return {
      token: newToken,
      refreshToken: newRefreshToken,
      message: "Token refreshed succesfully"
    }
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

  async LogOut(userId: string){
    await this.refreshTokenService.RemoveRefreshToken(userId);
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
