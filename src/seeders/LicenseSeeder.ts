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

            const testLicenses = Array.from({ length: licenseCount }, (_, i) => {
                const license = new License();
                license.licenseKey = `${licensePrefix}${i + 1}`;
                return license;
            });

            try {
                await em.insertMany(License, testLicenses);
            } catch (error) {
                this.logger?.log?.('Failed to insert test licenses:', error);
            }
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