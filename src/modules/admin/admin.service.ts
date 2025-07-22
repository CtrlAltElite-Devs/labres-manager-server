import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { AdminLoginResponseDto } from 'src/modules/admin/dto/admin-login-response.dto';
import { AdminLoginDto } from 'src/modules/admin/dto/admin-login.dto';
import { JwtUserPayloadDto } from 'src/utils/jwt-payload.dto';
import { Admin, AdminRole } from 'src/entities/admin.entity';
import { provideToken } from 'src/utils/jwt-utils';
import bcrypt from 'bcrypt';
import { AdminRegisterDto } from 'src/modules/admin/dto/admin-register.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: EntityRepository<Admin>,

        @Inject(CACHE_MANAGER) 
        private cacheManager: Cache
    ) {}

    async AdminLogin(dto: AdminLoginDto) {
        const admin = await this.adminRepository.findOne({email: dto.email});

        if(admin === null) throw new BadRequestException("Invalid Credentials");

        const isMatch = await bcrypt.compare(
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

        await this.adminRepository.insert(newAdmin);

        return newAdmin;
    }

    async GetAdminById(adminId: string){
        const adminCache = await this.cacheManager.get<Admin>(adminId);
        if(adminCache){
            this.logger.log(`Found admin cache: ${adminId}`);
            return adminCache
        }
        const admin =  await this.adminRepository.findOne({id: adminId});
        this.logger.log(`Setting admin cache: ${adminId}`);
        await this.cacheManager.set(adminId, admin);
        return admin;
    }
}
