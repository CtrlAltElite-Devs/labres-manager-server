import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { License } from 'src/entities/license.entity';
import { VerifyLicenseDto } from './dto/verify-license.dto';
import { VerifyLicenseResponseDto } from './dto/verify-license-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class LicenseService {
    private readonly logger = new Logger(LicenseService.name);

    constructor(
        @InjectRepository(License)
        private readonly licenseRepository: EntityRepository<License>,
        
        private readonly em: EntityManager,

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
        await this.em.flush();

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
        await this.cacheManager.set(fingerPrint, license);
        return license;
    }

}
