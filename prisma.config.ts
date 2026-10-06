import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

const isProduction = process.env.NODE_ENV === "production";
const envFiles = isProduction
  ? [".env"]
  : [".env.development.local", ".env.local", ".env"];

for (const file of envFiles) {
  if (existsSync(file)) process.loadEnvFile(file);
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.mjs",
  },
});
