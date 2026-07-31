import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRouteUser } from "@/lib/api-auth";

const updateSchema = z.object({
  draft: z.string().optional(),
  status: z.enum(["pending", "drafted", "edited", "unsure"]).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.requirement.findUnique({
    where: { id },
    include: { proposal: true },
  });
  if (!existing || existing.proposal.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const requirement = await prisma.requirement.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json({ requirement });
}
