import "dotenv/config";
import { defineConfig } from "prisma/config";

const migrationDatabaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

const baseConfig = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  }
};

export default migrationDatabaseUrl
  ? defineConfig({
      ...baseConfig,
      engine: "classic",
      datasource: { url: migrationDatabaseUrl }
    })
  : defineConfig(baseConfig);
