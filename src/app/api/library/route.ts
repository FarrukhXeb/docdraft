import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRouteUser } from "@/lib/api-auth";

const createSchema = z.object({
  topic: z.string().min(1).max(300),
  content: z.string().min(1),
  tags: z.string().max(300).optional(),
});

export async function GET() {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await prisma.answerEntry.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ entries });
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

  const entry = await prisma.answerEntry.create({
    data: { ...parsed.data, userId: user.id },
  });
  return NextResponse.json({ entry }, { status: 201 });
}
