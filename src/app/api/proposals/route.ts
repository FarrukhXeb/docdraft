import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRouteUser } from "@/lib/api-auth";

const createSchema = z.object({
  title: z.string().min(1).max(300),
  companyName: z.string().max(300).optional(),
  companyInfo: z.string().max(5000).optional(),
  // Raw pasted requirements, one per line.
  requirementsText: z.string().min(1),
});

/** Split pasted text into trimmed, non-empty requirement lines. */
function parseRequirements(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, "").trim())
    .filter((l) => l.length > 0);
}

export async function POST(req: Request) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const requirements = parseRequirements(parsed.data.requirementsText);
  if (requirements.length === 0) {
    return NextResponse.json(
      { error: "No requirements found. Paste at least one line." },
      { status: 400 }
    );
  }

  const proposal = await prisma.proposal.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      companyName: parsed.data.companyName,
      companyInfo: parsed.data.companyInfo,
      requirements: {
        create: requirements.map((prompt, i) => ({
          orderIndex: i,
          prompt,
        })),
      },
    },
  });

  return NextResponse.json({ proposal }, { status: 201 });
}
