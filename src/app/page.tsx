import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          DocDraft
        </h1>
        <p className="text-lg text-slate-600">
          Draft RFP and proposal responses in minutes. Keep a reusable answer
          library, paste your requirements, generate first drafts with AI, edit,
          and export to Word.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/register" className={buttonVariants()}>
          Get started
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Log in
        </Link>
      </div>
    </main>
  );
}
