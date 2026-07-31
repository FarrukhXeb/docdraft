/**
 * Side-effect module: load .env.local into process.env.
 * Imported FIRST by seed.ts so DATABASE_URL / auth secrets are set before the
 * Prisma client and better-auth modules are evaluated (ESM imports are hoisted,
 * so this must be its own module to run before them).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

try {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
} catch {
  // No .env.local - assume env is already provided by the shell.
}
