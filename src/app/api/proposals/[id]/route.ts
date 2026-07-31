import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRouteUser } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.proposal.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.proposal.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
