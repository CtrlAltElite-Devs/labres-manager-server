import { MikroORM } from "@mikro-orm/core";
import { INestApplication } from "@nestjs/common";
import { DatabaseSeeder } from "src/seeders/DatabaseSeeder";

export default async function InitializeDatabase(app: INestApplication<any>){
    await migrate(app);
    await seed(app);
}

async function migrate(app: INestApplication<any>){
    const orm = app.get(MikroORM);
    const migrator = orm.getMigrator();
    const migrationResult = await migrator.up();
    console.log("migration result: ", JSON.stringify(migrationResult, null, 3))
}

async function seed(app: INestApplication<any>){
    const orm = app.get(MikroORM);
    await orm.getSeeder().seed(DatabaseSeeder);
}

