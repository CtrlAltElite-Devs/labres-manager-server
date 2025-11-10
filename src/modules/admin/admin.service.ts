import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AdminLoginResponseDto } from 'src/modules/admin/dto/admin-login-response.dto';
import { AdminLoginDto } from 'src/modules/admin/dto/admin-login.dto';
import { JwtUserPayloadDto } from 'src/utils/jwt-payload.dto';
import { Admin, AdminRole } from 'src/entities/admin.entity';
import bcrypt from 'bcrypt';
import { AdminRegisterDto } from 'src/modules/admin/dto/admin-register.dto';
import { AdminDto } from './dto/admin.dto';
import { AdminCacheKey } from 'src/helpers/cache-helpers/admin.cache';
import { AdminUpdatePasswordDto } from './dto/admin-update-password.dto';
import { AdminRepository } from 'src/repositories/admin.repository';
import { RequestMetadata } from 'src/security/common/metadata-request';
import { CustomJwtService } from '../common/custom-jwt-service';
import { RefreshTokenService } from '../common/refresh-token-service';
import { RefreshTokenResponseDto } from '../auth/dto/refresh-token/refresh-token-response.dto';
import { UnitOfWork } from '../common/unit-of-work';
import { CacheService } from '../common/cache-service';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly unitOfWork: UnitOfWork,
        private readonly jwtService: CustomJwtService,
        private readonly refresthTokenService: RefreshTokenService,
        private readonly cacheService: CacheService
    ) { }

    async AdminLogin(dto: AdminLoginDto, metaData: RequestMetadata): Promise<AdminLoginResponseDto> {
        const admin = await this.adminRepository.findOne({ email: dto.email });

        if (admin === null) throw new BadRequestException("Invalid Credentials");

        const isMatch = await bcrypt.compare(
            dto.password,
            admin.password
        )

        if (!isMatch) {
            throw new BadRequestException("Invalid Credentials");
        }

        const payload = JwtUserPayloadDto.MapAdmin(admin);

        const { token, refreshToken } = await this.jwtService.CreateSignedTokens(payload);
        await this.refresthTokenService.Store(admin.id, refreshToken, metaData);

        const responseDto = AdminLoginResponseDto.Map(admin, token, refreshToken);
        return responseDto;
    }

    //todo common ni sya sa auth service maybe extract
    async Refresh(refreshToken: string, metaData: RequestMetadata): Promise<RefreshTokenResponseDto> {
        const { userId, token: newToken, refreshToken: newRefreshToken } = await this.refresthTokenService.RemoveAndReturnNewTokens(refreshToken, metaData);
        await this.refresthTokenService.Store(userId, newRefreshToken, metaData);

        return {
            token: newToken,
            refreshToken: newRefreshToken,
            message: "Token refreshed succesfully"
        }
    }

    async AdminRegister(dto: AdminRegisterDto) {
        const { email, password } = dto;

        const existing = await this.adminRepository.findOne({ email: email });

        if (existing !== null) throw new BadRequestException("admin email already exists");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin();
        newAdmin.email = email;
        newAdmin.password = hashedPassword;
        newAdmin.role = AdminRole.ADMIN;

        this.adminRepository.create(newAdmin);
        await this.unitOfWork.Commit();

        return newAdmin;
    }

    async GetAdminByIdForGuard(adminId: string): Promise<AdminDto | null> {
        const adminDtoCache = await this.cacheService.get<AdminDto>(AdminCacheKey(adminId));
        if (adminDtoCache) {
            this.logger.log(`Admin Cache Hit: ${adminId}`)
            return adminDtoCache;
        }

        this.logger.log(`Admin Cache Miss: ${adminId}`)
        const adminDto = await this.adminRepository.findOne({
            id: adminId,
        }, {
            fields: ["id", "email", "role"]
        });

        await this.cacheService.set(AdminCacheKey(adminId), adminDto, 1000 * 15);
        return adminDto;
    }

    async UpdateAdminPassword(adminId: string, dto: AdminUpdatePasswordDto) {
        const { oldPassword, newPassword: password } = dto;
        const admin = await this.adminRepository.findOne({ id: adminId });

        if (admin === null)
            throw new NotFoundException();

        const oldPasswordMatches = await bcrypt.compare(
            oldPassword,
            admin.password
        )

        if (!oldPasswordMatches)
            throw new BadRequestException();

        admin.password = await bcrypt.hash(password, 10);
        await this.unitOfWork.Commit({
            invalidateCacheKey: adminId
        })
    }

    async AdminLogOut(adminId: string) {
        await this.refresthTokenService.RemoveRefreshToken(adminId);
    }
}
