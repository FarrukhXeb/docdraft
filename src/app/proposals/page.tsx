import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { NewProposalForm } from "@/components/new-proposal-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function ProposalsPage() {
  const user = await requireUser();
  const proposals = await prisma.proposal.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { requirements: true } } },
  });

  return (
    <div>
      <Nav userEmail={user.email} />
      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proposals</h1>
          <p className="text-slate-600">
            Start a proposal by pasting the RFP requirements, then generate and
            edit drafted responses.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <NewProposalForm />

          <div className="space-y-3">
            {proposals.length === 0 && (
              <p className="text-slate-500">No proposals yet.</p>
            )}
            {proposals.map((p) => (
              <Link key={p.id} href={`/proposals/${p.id}`}>
                <Card className="transition-colors hover:border-slate-400">
                  <CardContent className="flex items-center justify-between pt-5">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {p.title}
                      </h3>
                      {p.companyName && (
                        <p className="text-sm text-slate-500">
                          {p.companyName}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-slate-500">
                      {p._count.requirements} requirements
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
