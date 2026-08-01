# DocDraft

Local-first web app that drafts **RFP / proposal responses**. Keep a reusable
answer library, paste your solicitation requirements, generate first-draft
answers with an LLM, edit them, and export a submission-ready **`.docx`**.

This is the first, runnable slice of the product core. It runs entirely on your
laptop — no cloud, no billing, no deploy.

## What it does

1. **Answer library** — add/edit reusable, company-approved answers and
   boilerplate (e.g. "Data security practices", "Past performance"). Stored in
   Postgres.
2. **Start a proposal** — paste RFP questions (one requirement per line). The
   app turns them into a simple compliance matrix.
3. **Generate drafts** — for each requirement, the app calls the LLM with the
   requirement + the most relevant answer-library entries + company context.
4. **Review & edit** — edit each drafted answer inline and flag ones you are
   unsure about.
5. **Export to Word** — download a `.docx` of the finished Q&A responses.

## Stack

- **Next.js (App Router) + TypeScript + Tailwind CSS v4 + ported DocDraft design-system UI** (see `AGENTS.md` for the component/token layout)
- **Postgres** in Docker (`docker-compose.yml`)
- **Prisma** for schema + migrations
- **better-auth** (email/password) — auth as a library on the local Postgres
- **Provider-agnostic LLM layer** with a working **Groq** implementation
- **`docx`** npm library for Word export

## Prerequisites

- Node.js 20+ (built with Node 24)
- Docker + Docker Compose
- A Groq API key (free tier works): https://console.groq.com

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#    then edit .env.local and set at least:
#      GROQ_API_KEY   (your Groq key, starts with gsk_)
#      GROQ_MODEL     (e.g. llama-3.3-70b-versatile)
#      BETTER_AUTH_SECRET  (run: openssl rand -base64 32)
#    DATABASE_URL already matches docker-compose (host port 5433).

# 3. Start Postgres
docker compose up -d

# 4. Apply migrations (creates all tables)
npm run db:migrate      # or, for a non-dev apply: npm run db:deploy

# 5. (Optional) Seed a demo user + starter answer library
npm run db:seed
#    Demo login:  demo@docdraft.local  /  demopassword123

# 6. Run the app
npm run dev
# open http://localhost:3000
```

Then: register (or use the demo login) → add answer-library entries → start a
proposal by pasting requirements → **Generate missing drafts** → edit → **Export
.docx**.

> **Note on port 5432:** the compose file maps host **5433 → container 5432** to
> avoid clashing with any Postgres already running locally on 5432. `DATABASE_URL`
> in `.env.example` uses `5433` to match.

## Scripts

| Script               | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start the dev server                     |
| `npm run build`      | Production build                         |
| `npm run db:migrate` | Create/apply a dev migration             |
| `npm run db:deploy`  | Apply existing migrations (non-dev)      |
| `npm run db:seed`    | Seed demo user + answer library          |
| `npm run db:studio`  | Open Prisma Studio                       |

## LLM provider abstraction (plug-and-play)

The whole app talks to a single interface, `LLMProvider`
(`src/lib/llm/types.ts`). No application code names a vendor — it calls
`getLLMProvider()` (`src/lib/llm/index.ts`), which reads the **`LLM_PROVIDER`**
env var and constructs the matching implementation.

Currently shipped: **Groq** (`src/lib/llm/groq.ts`), via Groq's
OpenAI-compatible API at `https://api.groq.com/openai/v1`.

### Adding Anthropic later (config-only for callers)

1. Create `src/lib/llm/anthropic.ts` implementing `LLMProvider`:

   ```ts
   import Anthropic from "@anthropic-ai/sdk";
   import type { LLMProvider, LLMMessage, DraftOptions, DraftResult } from "./types";

   export class AnthropicProvider implements LLMProvider {
     readonly name = "anthropic";
     readonly model: string;
     private client: Anthropic;
     constructor(cfg: { apiKey: string; model: string }) {
       this.client = new Anthropic({ apiKey: cfg.apiKey });
       this.model = cfg.model;
     }
     async draft(messages: LLMMessage[], opts: DraftOptions = {}): Promise<DraftResult> {
       const system = messages.find((m) => m.role === "system")?.content;
       const rest = messages.filter((m) => m.role !== "system");
       const res = await this.client.messages.create({
         model: this.model,
         system,
         max_tokens: opts.maxTokens ?? 1024,
         temperature: opts.temperature ?? 0.3,
         messages: rest.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
       });
       const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
       return { text, model: this.model, provider: this.name };
     }
   }
   ```

2. Register it in `src/lib/llm/index.ts` (an example `case` is already stubbed
   in comments):

   ```ts
   case "anthropic":
     return new AnthropicProvider({
       apiKey: process.env.ANTHROPIC_API_KEY ?? "",
       model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest",
     });
   ```

3. Set `LLM_PROVIDER="anthropic"` (plus `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL`)
   in `.env.local`. **No other code changes.**

**AWS Bedrock** follows the same pattern: add `src/lib/llm/bedrock.ts` using
`@aws-sdk/client-bedrock-runtime`, add a `case "bedrock"`, set `LLM_PROVIDER`.

### A note on draft quality

Groq is used here as a fast, free **development stand-in**. Its open models
produce serviceable but not final-grade proposal prose. The production target is
**Claude (Anthropic)** — expect noticeably stronger drafts there. This slice
blocks only on the pipeline working end-to-end, not on answer quality.

## Prompt templates

Prompts live in the repo as code (`src/lib/llm/prompts.ts`), not the database —
so they are versioned and reviewable. `rankLibrary()` there does a simple
keyword-overlap ranking to pick relevant library entries (no embeddings/RAG in
this slice; the seam is clean for adding them later).

## Data model

Prisma schema in `prisma/schema.prisma`:

- better-auth: `User`, `Session`, `Account`, `Verification`
- app: `AnswerEntry` (library), `Proposal`, `Requirement` (compliance matrix row
  with its `draft` and `status`)

## Secrets

- Real secrets live only in **`.env.local`**, which is **gitignored**.
- Only `.env.example` (placeholders) is committed.
- The Groq key never appears in any committed file, the README, or a commit
  message. Verify with `git grep gsk_` (should return nothing).

## Explicitly deferred (not in this slice)

PDF/DOCX upload & parsing, Stripe/billing, AWS/Terraform/deploy, SQS/queues,
multi-template, RAG, teams/SSO, usage metering. Clean seams are left for them.
