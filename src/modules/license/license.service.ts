import { BadRequestException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { License } from 'src/entities/license.entity';
import { VerifyLicenseDto } from './dto/verify-license.dto';
import { VerifyLicenseResponseDto } from './dto/verify-license-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateLicenseDto } from './dto/create-license.dto';
import { RevokeLicenseResponseDto as StatusLicenseResponseDto } from './dto/revoke-license-response.dto';
import LicenseRepository from 'src/repositories/license.repository';
import { UnitOfWork } from '../common/unit-of-work';

@Injectable()
export class LicenseService {
    private readonly logger = new Logger(LicenseService.name);

    constructor(
        private readonly licenseRepository: LicenseRepository,
        
        private readonly em: EntityManager,

        private readonly unitOfWork: UnitOfWork,

        @Inject(CACHE_MANAGER) 
        private cacheManager: Cache
    ){}

    async Verify(dto: VerifyLicenseDto): Promise<VerifyLicenseResponseDto> {
        const { fingerPrint, licenseKey } = dto;

        const license = await this.licenseRepository.findOne({ licenseKey });

        if (!license) {
            return {
                success: false,
                message: 'Invalid License',
            };
        }

        const existingFingerPrint = license.fingerPrint;

        if (existingFingerPrint) {
            if(license.isRevoked)
                return {
                    success: false,
                    message: "This license was revoked please contact the company"
                }

            const isSameMachine = existingFingerPrint === fingerPrint;

            return {
                success: isSameMachine,
                message: isSameMachine
                    ? 'License Verified'
                    : 'License Already Taken',
            };
        }

        // First-time activation
        license.fingerPrint = fingerPrint;
        await this.unitOfWork.Commit();

        return {
            success: true,
            message: 'License Verified',
        };
    }

    async GetLicenseByFingerPrint(fingerPrint: string){
        const cachedLicense = await this.cacheManager.get<License>(fingerPrint);

        if(cachedLicense){
            this.logger.log("Found machine cache");
            return cachedLicense;
        }

        const license = await this.licenseRepository.findOne({
            fingerPrint
        })

        this.logger.log("Setting machine cache");
        if(license !== null){
            await this.cacheManager.set(fingerPrint, license, 1000*10);
        }
        return license;
    }

    async AddLicense(dto: CreateLicenseDto) : Promise<License>{
        // check if license exists
        const existing = await this.licenseRepository.findOne({
            licenseKey: dto.licenseKey
        })

        if(existing !== null){
            this.logger.log("License key already exists");
            throw new BadRequestException("License key already exists");
        }

        // add license
        const newLicense = License.Create(dto.licenseKey);
        this.licenseRepository.Add(newLicense);
        await this.unitOfWork.Commit();

        // return created license
        return newLicense;
    }

    async RevokeLicense(licenseId: string) : Promise<StatusLicenseResponseDto>{
        const license = await this.licenseRepository.findOne({licenseId});
        if(license === null){
            this.logger.log("License not found");
            throw new NotFoundException("License not found")
        }

        if(license.isRevoked){
            throw new BadRequestException("License already revoked")
        }

        license.Revoke();
        await this.unitOfWork.Commit({
            invalidateKey: license.fingerPrint
        })

        return {
            success: true,
            message: `License ${license.licenseId} Revoked`
        }
    }

    async ReactivateLicense(licenseId: string){
        const license = await this.licenseRepository.findOne({licenseId});
        if(license === null){
            this.logger.log("License not found");
            throw new NotFoundException("License not found")
        }

        if(!license.isRevoked){
            throw new BadRequestException("License is already activated")
        }

        license.Reactivate();
        await this.unitOfWork.Commit({
            invalidateKey: license.fingerPrint
        })

        return {
            success: true,
            message: `License ${license.licenseId} Activated`
        }
    }

    async GetAllLicenses() : Promise<License[]>{
        const licenses = await this.licenseRepository.findAll({orderBy: {createdAt: "DESC"}});
        return licenses;
    }
}
