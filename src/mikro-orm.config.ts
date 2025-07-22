import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { entities } from "./entities/index.entity";
import { Migrator } from "@mikro-orm/migrations";
import "dotenv/config";

export default defineConfig({
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL!,
  entities: entities,
  extensions: [Migrator],
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
});