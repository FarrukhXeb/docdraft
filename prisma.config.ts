// Prisma config file (replaces the deprecated `package.json#prisma` key).
//
// The Prisma CLI (migrate / deploy / generate / studio) does NOT auto-load
// `.env.local` - only a file literally named `.env`. The captain keeps real
// values only in `.env.local`, so we reuse the existing side-effect loader to
// populate process.env before the CLI reads DATABASE_URL & friends.
//
// NOTE: once a Prisma config file exists, Prisma stops auto-loading any `.env`
// file itself, so this import is the single source of env for all CLI commands.
import "./prisma/load-env";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
