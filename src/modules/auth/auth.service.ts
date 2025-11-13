import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/entities/user.entity';
import bcrypt from 'bcrypt';
import { CheckPidResponseDto } from './dto/check-pid-response.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtUserPayloadDto } from '../../utils/jwt-payload.dto';
import { UserDto } from './dto/user.dto';
import { UserCacheKey } from 'src/helpers/cache-helpers/user.cache';
import { LoginResponseV2Dto } from './dto/login/login-response-v2.dto';
import { LoginResponseDto } from './dto/login/login-response.dto';
import { CustomJwtService } from '../common/custom-jwt-service';
import { RefreshTokenService } from '../common/refresh-token-service';
import { RequestMetadata } from 'src/security/common/metadata-request';
import { RefreshTokenResponseDto } from './dto/refresh-token/refresh-token-response.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { UnitOfWork } from '../common/unit-of-work';
import { CacheService } from '../common/cache-service';
import { IdentifyRequestDto } from './dto/identify/identify.request.dto';
import { IdentifyResponseDto } from './dto/identify/identify.response.dto';
// import { RegisterEmailDto } from './dto/register-email/register-email.dto';
import { VerifyEmailDto } from './dto/verify-email/verify-email.dto';
import { EmailService } from '../common/email-service';
import { OTPRepository } from 'src/repositories/otp.repository';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly unitOfWork: UnitOfWork,
    private readonly cacheService: CacheService,
    private readonly jwtService: CustomJwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly emailService: EmailService,
    private readonly otpRepository: OTPRepository
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
    const { userId, token: newToken, refreshToken: newRefreshToken } = await this.refreshTokenService.RemoveAndReturnNewTokens(refreshToken, metaData);
    await this.refreshTokenService.Store(userId, newRefreshToken, metaData);
    
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

    await this.unitOfWork.Commit({
      invalidateCacheKey: UserCacheKey(pid)
    })

    return user;
  }

  async GetUserById(pid: string) {
    return await this.userRepository.findOne({pid});
  }

  async LogOut(userId: string){
    await this.refreshTokenService.RemoveRefreshToken(userId);
  }

  async GetUserByIdForGuard(pid: string){
    const userDtoCache = await this.cacheService.get<UserDto>(UserCacheKey(pid));
    if(userDtoCache){
      this.logger.log(`User cache hit: ${pid}`)
      return userDtoCache;
    }

    const user = await this.userRepository.findOne({pid}, {
      fields: ["pid", "dob", "emailVerified", "lastName"]
    })
    this.logger.log(`User cache miss: ${pid}`);
    if(user === null){
      await this.cacheService.set(UserCacheKey(pid), null, 1000*10);
      return null;
    } else {
      const userDto = new UserDto();
      userDto.pid = user.pid;
      userDto.dob = user.dob;
      userDto.emailVerified = user.emailVerified;
      userDto.lastName = user.lastName;
      await this.cacheService.set(UserCacheKey(pid), userDto, 1000*10);
      return userDto;
    }
  }

  async IdentifyStep1(pid:string){
    const user = await this.userRepository.findOne({pid});

    if(user === null){
      this.logger.log("User was not found");
      return IdentifyResponseDto.NotFound();
    }
    
    if(user.needsOnboarding())
      return IdentifyResponseDto.NeedsOnboarding(user.pid);

    return IdentifyResponseDto.ReadyToLogin(user);
  }
  
  async IdentifyStep2(dto: IdentifyRequestDto) : Promise<IdentifyResponseDto>{
    const user = await this.userRepository.findOne({pid: dto.pid});

    if(user === null){
      this.logger.log("User was not found");
      return IdentifyResponseDto.NotFound();
    }

    if(user.lastName?.toUpperCase() !== dto.lastname.toUpperCase()){
      this.logger.log("User last name mismatch");
      return IdentifyResponseDto.NotFound();
    }

    const userDob = new Date(user.dob!).toISOString().split('T')[0];
    const dtoDob = new Date(dto.dob).toISOString().split('T')[0];

    if (userDob !== dtoDob) {
      this.logger.log(`User dob mismatch:: ${userDob} and ${dtoDob}`);
      return IdentifyResponseDto.NotFound();
    }

    if(!user.email){
      return IdentifyResponseDto.NeedsEmail(user.pid);
    }

    if(!user.password){
      return IdentifyResponseDto.EmailRegistered(user);
    }

    return IdentifyResponseDto.ReadyToLogin(user);
  }

  // async RegisterEmail(dto: RegisterEmailDto){
  //   const user = await this.userRepository.findOne({pid: dto.pid});
  //   if(user === null) throw new BadRequestException("pid not found")

  //   if(user.email){
  //     throw new BadRequestException("User already registered with an existing email");
  //   }

  //   user.email = dto.email;

  //   await this.unitOfWork.Commit({invalidateCacheKey: UserCacheKey(user.pid)})

  //   // simulate otp or create a dedicted service

  //   return {
  //     status: "otp_sent",
  //     message: `Verification code sent to ${user.email}`
  //   }
  // }

  async VerifyEmail(dto: VerifyEmailDto){
    const user = await this.userRepository.findOne({pid: dto.pid});
    if(user === null) throw new BadRequestException("pid not found")

    const otp = await this.otpRepository.findOne({email: dto.email});

    if(otp === null) 
      throw new BadRequestException("Invalid or expired Code");

    if(otp.code !== dto.code)
      throw new BadRequestException("Invalid or expired Code")

    user.emailVerified = true;
    user.email = dto.email;

    await this.unitOfWork.Commit({invalidateCacheKey: UserCacheKey(user.pid)})

    return {
      message: "Email Verification Successful"
    }
  }

  async UpdatePasswordV2(dto: UpdatePasswordDto){
    const user = await this.userRepository.findOne({pid: dto.pid});
    if(user === null) throw new BadRequestException("pid not found")

    if(!user.emailVerified || !user.email) 
      throw new BadRequestException("email is not yet verified");

    user.password = await bcrypt.hash(dto.password, 10);
  
    await this.unitOfWork.Commit({
      invalidateCacheKey: UserCacheKey(user.pid)
    })

    const responseDto = new UserDto();
    responseDto.pid = user.pid;
    responseDto.lastName = user.lastName;
    responseDto.emailVerified = user.emailVerified;
    responseDto.dob = user.dob;
    return responseDto;
  }

  async SendVerificationEmail(email: string){
    await this.emailService.sendVerificationEmail(email);

    return {
      message: "We have sent you an email, please check your inbox for the OTP."
    }
  }

}
