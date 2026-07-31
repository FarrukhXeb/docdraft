import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Logo } from "@/components/ui/logo";

export default async function Home() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-8)",
        padding: "var(--space-12) var(--gutter-page)",
        textAlign: "center",
        background: "var(--surface-app)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-4)",
          maxWidth: "48ch",
        }}
      >
        <Logo size="lg" />
        <p
          style={{
            margin: 0,
            font: "var(--type-body)",
            fontSize: "var(--text-lg)",
            color: "var(--text-secondary)",
            textWrap: "pretty",
          }}
        >
          Draft RFP and proposal responses in minutes. Keep a reusable answer
          library, paste your requirements, generate first drafts with AI, edit,
          and export to Word.
        </p>
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <Link
          href="/register"
          className="dd-btn dd-focus dd-btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "var(--h-control)",
            padding: "0 16px",
            borderRadius: "var(--radius-md)",
            font: "var(--type-label)",
            background: "var(--primary)",
            color: "var(--primary-fg)",
            border: "1px solid transparent",
          }}
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="dd-btn dd-focus dd-btn-outline"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "var(--h-control)",
            padding: "0 16px",
            borderRadius: "var(--radius-md)",
            font: "var(--type-label)",
            background: "var(--surface-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
          }}
        >
          Log in
        </Link>
      </div>
    </main>
  );
}
