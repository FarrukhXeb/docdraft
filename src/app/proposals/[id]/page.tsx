import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { ProposalWorkspace } from "@/components/proposal-workspace";

type Params = { params: Promise<{ id: string }> };

export default async function ProposalDetailPage({ params }: Params) {
  const user = await requireUser();
  const { id } = await params;

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: { requirements: { orderBy: { orderIndex: "asc" } } },
  });
  if (!proposal || proposal.userId !== user.id) notFound();

  return (
    <div>
      <Nav userEmail={user.email} />
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        <div>
          <Link
            href="/proposals"
            className="text-sm text-[var(--text-muted)] hover:underline"
          >
            ← All proposals
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
            {proposal.title}
          </h1>
          {proposal.companyName && (
            <p className="text-[var(--text-secondary)]">{proposal.companyName}</p>
          )}
        </div>

        <ProposalWorkspace
          proposalId={proposal.id}
          requirements={proposal.requirements.map((r) => ({
            id: r.id,
            prompt: r.prompt,
            draft: r.draft,
            status: r.status,
          }))}
        />
      </main>
    </div>
  );
}
