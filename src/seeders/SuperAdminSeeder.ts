import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Logger } from "@nestjs/common";
import bcrypt from 'bcrypt';
import { Admin, AdminRole } from '../entities/admin.entity';
import "dotenv/config";

export class SuperAdminSeeder extends Seeder {
    private readonly logger = new Logger(SuperAdminSeeder.name)
    async run(em: EntityManager): Promise<void> {
        this.logger.log("Seeding Database Super admin");
        const email = process.env.SUPER_ADMIN_EMAIL;
        const password = process.env.SUPER_ADMIN_PASSWORD;

        if(!email || !password) {
            this.logger.log("Failed to seed super admin, make sure email and password is in .env file")
            return;
        }

        const exists = await em.findOne(Admin, {email});
        if(exists){
            this.logger.log("Super admin already added");
            return;
        }
        const superAdmin = new Admin();
        superAdmin.email = email;
        superAdmin.password = await bcrypt.hash(password, 10);
        superAdmin.role = AdminRole.SUPER_ADMIN;

        await em.insert(Admin, superAdmin);        
        this.logger.log("Super admin seeded");
    }

}