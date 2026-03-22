import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Logger } from "@nestjs/common";
import "dotenv/config";
import { License } from '../entities/license.entity';

export class LicenseSeeder extends Seeder {
    private readonly logger = new Logger(LicenseSeeder.name);
    
    async run(em: EntityManager): Promise<void> {
        const executeSeeder = async () => {
            const masterLicenseKey = process.env.SUPER_LICENSE;
            if (process.env.NODE_ENV !== 'production') {
                const licenseCount = 10;
                const licensePrefix = 'TEST_LICENSE';
                const savedLicenses = await em.findAll(License);
                const existingKeys = new Set(savedLicenses.map(l => l.licenseKey));

                const missingLicenses = Array.from({ length: licenseCount }, (_, i) => `${licensePrefix}${i + 1}`)
                    .filter(key => !existingKeys.has(key))
                    .map(key => {
                        const license = new License();
                        license.licenseKey = key;
                        return license;
                    });

                if (missingLicenses.length > 0) {
                    await em.insertMany(License, missingLicenses);
                    this.logger.log(`Inserted ${missingLicenses.length} missing test license(s)`);
                } else {
                    this.logger.log("Database already has all test licenses");
                }
            }
    
            if(!masterLicenseKey){
                this.logger.fatal("Failed to seed super license, make sure super license is in .env file");
                return;
            }
    
            const exists = await em.findOne(License, {licenseKey: masterLicenseKey});
    
            if(exists){
                this.logger.log("Master License key is already added");
                return;
            }
    
            const license = new License();
            license.licenseKey = masterLicenseKey!;
            
            await em.insert(License, license);
            this.logger.log("Super License seeded");
        }

        await this.licenseSeederRunner(executeSeeder);   
    }

    private async licenseSeederRunner(delegate: () => Promise<void>){
        await delegate();
        this.logger.log(`Finished running ${LicenseSeeder.name}`);
    }

}