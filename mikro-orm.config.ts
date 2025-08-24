import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { SeedManager } from "@mikro-orm/seeder";
import "dotenv/config";
import { entities } from './src/entities/index.entity';

const getConnectionStrategy = () => {
  const isNeon = process.env.DATABASE_URL?.includes('neon.tech');
  if(isNeon) {
    return {
      ssl: {
        rejectUnauthorized: false, // required for Neon
      }
    }
  }

  return {
    ssl: false
  }

}

export default defineConfig({
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL!,
  entities: entities,
  extensions: [Migrator, SeedManager],
  driverOptions: {
    connection: getConnectionStrategy()
  },
  debug: true,
  migrations: {
    path: "dist/src/migrations",
    pathTs: "src/migrations",
  },
  seeder: {
    path: "dist/src/seeders",
    pathTs: "src/seeders"
  }
});