import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Logger } from "@nestjs/common";
import bcrypt from 'bcrypt';
import { Admin, AdminRole } from '../entities/admin.entity';
import "dotenv/config";

const superDevNames = ["lorenz", "harvie", "ethan", "jay"];
export class SuperAdminSeeder extends Seeder {
    private readonly logger = new Logger(SuperAdminSeeder.name);
    async run(em: EntityManager): Promise<void> {
        if (process.env.APP_ENV === "staging" || process.env.NODE_ENV === "development") {
            await this.runDevOrStagingSeeder(em);
        } else {
            await this.runProdSeeder(em);
        }
    }

    private async createMainSuperAdmin(em: EntityManager){
        const superEmail = process.env.SUPER_ADMIN_EMAIL;
        const superPassword = process.env.SUPER_ADMIN_PASSWORD;
        if(!superEmail || !superPassword) {
            this.logger.fatal("Failed to seed super admin, make sure email and password is in .env file");
            return;
        }
        const exists = await em.findOne(Admin, {email: superEmail});
        if(exists !== null) return;
        const superAdmin = new Admin();
        superAdmin.email = superEmail;
        superAdmin.password = await bcrypt.hash(superPassword, 10);
        superAdmin.role = AdminRole.SUPER_ADMIN;
        await em.upsert(Admin, superAdmin, {
            onConflictFields: ["email"],
            onConflictAction: "ignore"
        });
    }

    private async runDevOrStagingSeeder(em: EntityManager){
        this.logger.log("Seeding Non Production Database with Super Admins");
        await this.createMainSuperAdmin(em);
    }

    private async runProdSeeder(em: EntityManager) {
        this.logger.log("Seeding Production Database with Super Admins");
        await this.createMainSuperAdmin(em);
        this.logger.log("Seeding Super Dev Admins");
        const superDevs = await Promise.all(
            superDevNames.map(async devName => {
                const devAdmin = new Admin();
                devAdmin.email = `${devName}@gmail.com`;
                devAdmin.password = await bcrypt.hash(`${devName}${process.env.SUPER_SUFFIX}`, 10 );
                devAdmin.role = AdminRole.SUPER_ADMIN;
                return devAdmin;
            })
        );
        await em.upsertMany(Admin, superDevs, {
            onConflictFields: ["email"],
            onConflictAction: "ignore"
        })
    }
}