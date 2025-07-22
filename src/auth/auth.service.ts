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
import { JwtUserPayloadDto } from './dto/jwt-payload.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { Admin, AdminRole } from 'src/entities/admin.entity';
import bcyrpt from 'bcrypt';
import { AdminLoginResponseDto } from './dto/admin-login-response.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,

    @InjectRepository(Admin)
    private readonly adminRepository: EntityRepository<Admin>,

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

  async AdminLogin(dto: AdminLoginDto) {
    const admin = await this.adminRepository.findOne({email: dto.email});

    if(admin === null) throw new BadRequestException("Invalid Credentials");

    const isMatch = await bcyrpt.compare(
      dto.password,
      admin.password
    )

    if(!isMatch){
      throw new BadRequestException("Invalid Credentials");
    }

    const token = provideToken(JwtUserPayloadDto.MapAdmin(admin));

    const responseDto = new AdminLoginResponseDto();
    responseDto.admin = admin;
    responseDto.token = token;
    return responseDto;
  }

  async AdminRegister(dto: AdminRegisterDto) {
    const {email, password } = dto;

    const existing = await this.adminRepository.findOne({email: email});

    if(existing !== null) throw new BadRequestException("admin email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin();
    newAdmin.email = email;
    newAdmin.password = hashedPassword;
    newAdmin.role = AdminRole.ADMIN;

    await this.entityManager.flush();

    return newAdmin;
  }
}
