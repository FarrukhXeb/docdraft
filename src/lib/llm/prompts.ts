import type { LLMMessage } from "./types";

/**
 * Prompt templates live in the repo as code (not the DB) for this slice.
 * Keeping them here makes them reviewable, versioned, and easy to tune.
 */

export interface DraftContext {
  requirement: string;
  companyName?: string | null;
  companyInfo?: string | null;
  /** Relevant answer-library entries, already ranked by relevance. */
  library: { topic: string; content: string }[];
}

const SYSTEM_PROMPT = `You are an expert proposal writer helping a company respond to an RFP (Request for Proposal). \
You write clear, professional, compliant responses in the company's voice. \
Use ONLY the approved company context and answer-library material provided. \
Do not invent facts, certifications, customers, or numbers that are not supported by the provided context. \
If the provided context is insufficient, write the best professional response you can and clearly flag any assumptions. \
Respond in well-structured prose suitable for pasting directly into a proposal document.`;

export function buildDraftMessages(ctx: DraftContext): LLMMessage[] {
  const libraryBlock =
    ctx.library.length > 0
      ? ctx.library
          .map(
            (e, i) =>
              `[Library #${i + 1}] Topic: ${e.topic}\nApproved answer: ${e.content}`
          )
          .join("\n\n")
      : "(no matching answer-library entries were found)";

  const companyBlock = [
    ctx.companyName ? `Company name: ${ctx.companyName}` : null,
    ctx.companyInfo ? `Company context: ${ctx.companyInfo}` : null,
  ]
    .filter(Boolean)
    .join("\n") || "(no company context provided)";

  const user = `COMPANY CONTEXT
${companyBlock}

APPROVED ANSWER LIBRARY (reuse and adapt this material where relevant)
${libraryBlock}

RFP REQUIREMENT TO RESPOND TO
${ctx.requirement}

Write a complete, professional response to the requirement above. \
Return only the response text, with no preamble like "Here is the response".`;

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: user },
  ];
}

/**
 * Naive relevance ranking for this slice (no embeddings / RAG yet).
 * Scores library entries by keyword overlap with the requirement and returns
 * the top `limit`. A real RAG ranker can replace this without touching callers.
 */
export function rankLibrary<T extends { topic: string; content: string }>(
  requirement: string,
  entries: T[],
  limit = 4
): T[] {
  const terms = tokenize(requirement);
  if (terms.size === 0) return entries.slice(0, limit);

  return entries
    .map((e) => {
      const hay = tokenize(`${e.topic} ${e.content}`);
      let score = 0;
      for (const t of terms) if (hay.has(t)) score += 1;
      return { e, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter((x, i) => x.score > 0 || i < 2) // always keep a couple as fallback
    .map((x) => x.e);
}

function tokenize(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
}
