import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRouteUser } from "@/lib/api-auth";
import { getLLMProvider } from "@/lib/llm";
import { buildDraftMessages, rankLibrary } from "@/lib/llm/prompts";

const bodySchema = z.object({
  // Optional: regenerate only these requirement ids. Omit = all pending/empty.
  requirementIds: z.array(z.string()).optional(),
  regenerateAll: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: { requirements: { orderBy: { orderIndex: "asc" } } },
  });
  if (!proposal || proposal.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = bodySchema.safeParse(await req.json().catch(() => ({})));
  const opts = body.success ? body.data : {};

  // Decide which requirements to (re)draft.
  let targets = proposal.requirements;
  if (opts.requirementIds?.length) {
    const set = new Set(opts.requirementIds);
    targets = targets.filter((r) => set.has(r.id));
  } else if (!opts.regenerateAll) {
    targets = targets.filter((r) => r.draft.trim().length === 0);
  }

  if (targets.length === 0) {
    return NextResponse.json({ updated: [], message: "Nothing to draft." });
  }

  const library = await prisma.answerEntry.findMany({
    where: { userId: user.id },
  });

  let provider;
  try {
    provider = getLLMProvider();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  const updated: { id: string; draft: string; status: string }[] = [];
  const errors: { id: string; error: string }[] = [];

  // Sequential in-process loop is fine for this slice (a handful of questions).
  for (const req of targets) {
    try {
      const ranked = rankLibrary(req.prompt, library);
      const messages = buildDraftMessages({
        requirement: req.prompt,
        companyName: proposal.companyName,
        companyInfo: proposal.companyInfo,
        library: ranked.map((e) => ({ topic: e.topic, content: e.content })),
      });
      const result = await provider.draft(messages, {
        temperature: 0.3,
        maxTokens: 1024,
      });
      const saved = await prisma.requirement.update({
        where: { id: req.id },
        data: { draft: result.text.trim(), status: "drafted" },
      });
      updated.push({ id: saved.id, draft: saved.draft, status: saved.status });
    } catch (err) {
      errors.push({ id: req.id, error: (err as Error).message });
    }
  }

  return NextResponse.json({
    updated,
    errors,
    provider: provider.name,
    model: provider.model,
  });
}
