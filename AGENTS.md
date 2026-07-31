# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.

## What this is

DocDraft: local-first Next.js app that drafts RFP/proposal responses. See `README.md` for setup, scripts, and the full feature list.

## Key facts

- **Setup, scripts, provider-swap steps:** `README.md` is authoritative.
- **Postgres runs on host port 5433** (mapped to container 5432 in `docker-compose.yml`) to avoid clashing with a local Postgres on 5432. `DATABASE_URL` must use 5433.
- **Secrets:** real values live only in gitignored `.env.local`; commit only `.env.example`. Never commit a `gsk_` key. Run `git grep gsk_` before committing.
- **LLM layer:** all code calls `getLLMProvider()` (`src/lib/llm/index.ts`) — never name a vendor directly. Add providers by implementing `LLMProvider` (`src/lib/llm/types.ts`) and adding a `case`. Prompts are code in `src/lib/llm/prompts.ts`, not the DB.
- **Auth:** better-auth (email/password), Prisma adapter, models in `prisma/schema.prisma`. Route handlers gate via `getRouteUser()` (`src/lib/api-auth.ts`); pages via `requireUser()` (`src/lib/session.ts`).
- **Seed** (`prisma/seed.ts`) imports `./load-env` FIRST so `.env.local` is loaded before Prisma/auth modules evaluate (ESM import hoisting). Creates demo user `demo@docdraft.local` / `demopassword123`.
- **Deferred (do not build without scope change):** PDF/DOCX upload, billing, AWS/deploy, SQS, RAG, teams/SSO. Seams are intentionally left clean.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
