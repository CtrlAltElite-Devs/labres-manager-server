import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { entities } from "./entities/index.entity";
import { Migrator } from "@mikro-orm/migrations";
import "dotenv/config";
import { SeedManager } from "@mikro-orm/seeder";

const isNeon = process.env.DATABASE_URL?.includes('neon.tech');

export default defineConfig({
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL!,
  entities: entities,
  extensions: [Migrator, SeedManager],
  driverOptions: {
      connection: isNeon
        ? {
            ssl: {
              rejectUnauthorized: false, // required for Neon
            },
          }
        : {
            ssl: false, // for local
          },
    },
  debug: true,
});