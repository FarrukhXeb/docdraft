import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRouteUser } from "@/lib/api-auth";

const updateSchema = z.object({
  topic: z.string().min(1).max(300).optional(),
  content: z.string().min(1).optional(),
  tags: z.string().max(300).nullable().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.answerEntry.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const entry = await prisma.answerEntry.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json({ entry });
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.answerEntry.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.answerEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
