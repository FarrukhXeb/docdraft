import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { LibraryManager } from "@/components/library-manager";

export default async function LibraryPage() {
  const user = await requireUser();
  const entries = await prisma.answerEntry.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <Nav userEmail={user.email} />
      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Answer Library</h1>
          <p className="text-slate-600">
            Reusable, company-approved answers and boilerplate. These feed the AI
            when drafting proposal responses.
          </p>
        </div>
        <LibraryManager
          initialEntries={entries.map((e) => ({
            id: e.id,
            topic: e.topic,
            content: e.content,
            tags: e.tags,
          }))}
        />
      </main>
    </div>
  );
}
