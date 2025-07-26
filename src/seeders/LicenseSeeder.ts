import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Logger } from "@nestjs/common";
import "dotenv/config";
import { License } from '../entities/license.entity';


export class LicenseSeeder extends Seeder {
    private readonly logger = new Logger(LicenseSeeder.name);
    
    async run(em: EntityManager): Promise<void> {
        const masterLicenseKey = process.env.SUPER_LICENSE;
        
        if (process.env.NODE_ENV !== 'production') {
            const licenseCount = 10; // 👈 change this to whatever `n` you want
            const licensePrefix = 'TEST_LICENSE';

            const testLicenses = Array.from({ length: licenseCount }, (_, i) => `${licensePrefix}${i + 1}`);

            await Promise.all(
                testLicenses.map(async (licenseKey) => {
                    try {
                        const license = new License();
                        license.licenseKey = licenseKey;
                        await em.insert(License, license);
                    } catch (error) {
                        this.logger?.log?.(`Failed to insert license ${licenseKey}:`, error);
                    }
                })
            );
        }

        if(!masterLicenseKey){
            this.logger.fatal("Failed to seed super license, make sure super license is in .env file")
        }

        const exists = await em.findOne(License, {licenseKey: masterLicenseKey});

        if(exists){
            this.logger.log("License key is already added");
            return;
        }

        const license = new License();
        license.licenseKey = masterLicenseKey!;
        
        await em.insert(License, license);
        this.logger.log("Super License seeded");
    }

}