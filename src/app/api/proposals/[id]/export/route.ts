import { prisma } from "@/lib/prisma";
import { getRouteUser } from "@/lib/api-auth";
import { buildProposalDocx, docxFilename } from "@/lib/docx";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const user = await getRouteUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: { requirements: { orderBy: { orderIndex: "asc" } } },
  });
  if (!proposal || proposal.userId !== user.id) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = await buildProposalDocx({
    title: proposal.title,
    companyName: proposal.companyName,
    requirements: proposal.requirements.map((r) => ({
      orderIndex: r.orderIndex,
      prompt: r.prompt,
      draft: r.draft,
      status: r.status,
    })),
  });

  const filename = docxFilename(proposal.title);
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
