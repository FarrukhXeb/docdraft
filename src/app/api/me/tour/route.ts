import { NextResponse } from "next/server";
import { z } from "zod";
import { getRouteUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  status: z.enum(["completed", "skipped"]),
});

export async function GET() {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profile, latestProposal] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { onboardingTourStatus: true },
    }),
    prisma.proposal.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    }),
  ]);

  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    status: profile.onboardingTourStatus.toLowerCase(),
    latestProposalId: latestProposal?.id ?? null,
  });
}

export async function PATCH(req: Request) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const onboardingTourStatus = parsed.data.status.toUpperCase() as
    | "COMPLETED"
    | "SKIPPED";
  const profile = await prisma.user.update({
    where: { id: user.id },
    data: { onboardingTourStatus },
    select: { onboardingTourStatus: true },
  });

  return NextResponse.json({
    status: profile.onboardingTourStatus.toLowerCase(),
  });
}
