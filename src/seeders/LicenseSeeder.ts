import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Logger } from "@nestjs/common";
import "dotenv/config";
import { License } from '../entities/license.entity';


export class LicenseSeeder extends Seeder {
    private readonly logger = new Logger(LicenseSeeder.name);
    
    async run(em: EntityManager): Promise<void> {
        this.logger.log("Seeding Sample License");

        const licenseKey = process.env.SUPER_LICENSE;

        if(!licenseKey){
            this.logger.fatal("Failed to seed super license, make sure super license is in .env file")
        }

        const exists = await em.findOne(License, {licenseKey});

        if(exists){
            this.logger.log("License key is already added");
            return;
        }

        const license = new License();
        license.licenseKey = licenseKey!;
        
        await em.insert(License, license);
        this.logger.log("Super License seeded");
    }

}