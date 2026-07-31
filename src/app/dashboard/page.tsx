import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await requireUser();

  const [answerCount, proposalCount] = await Promise.all([
    prisma.answerEntry.count({ where: { userId: user.id } }),
    prisma.proposal.count({ where: { userId: user.id } }),
  ]);

  return (
    <div>
      <Nav userEmail={user.email} />
      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome{user.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-slate-600">
            Build your answer library, then turn RFP questions into drafted
            responses.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/library">
            <Card className="transition-colors hover:border-slate-400">
              <CardHeader>
                <CardTitle>Answer Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">
                  {answerCount}
                </p>
                <p className="text-sm text-slate-500">reusable entries</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/proposals">
            <Card className="transition-colors hover:border-slate-400">
              <CardHeader>
                <CardTitle>Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">
                  {proposalCount}
                </p>
                <p className="text-sm text-slate-500">in progress</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
