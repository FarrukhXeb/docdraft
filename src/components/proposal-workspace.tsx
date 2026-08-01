"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Req {
  id: string;
  prompt: string;
  draft: string;
  status: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-[var(--status-pending-bg)] text-[var(--status-pending-fg)]",
  drafted: "bg-[var(--status-drafted-bg)] text-[var(--status-drafted-fg)]",
  edited: "bg-[var(--status-edited-bg)] text-[var(--status-edited-fg)]",
  unsure: "bg-[var(--status-unsure-bg)] text-[var(--status-unsure-fg)]",
};

export function ProposalWorkspace({
  proposalId,
  requirements: initial,
}: {
  proposalId: string;
  requirements: Req[];
}) {
  const [reqs, setReqs] = useState<Req[]>(initial);
  const [generating, setGenerating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(id: string, patch: Partial<Req>) {
    setReqs((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function generateAll(regenerateAll: boolean) {
    setError(null);
    setGenerating(true);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerateAll }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      for (const u of data.updated as Req[]) {
        update(u.id, { draft: u.draft, status: u.status });
      }
      if (data.errors?.length) {
        setError(
          `${data.errors.length} requirement(s) failed: ${data.errors
            .map((e: { error: string }) => e.error)
            .join("; ")}`
        );
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  async function generateOne(id: string) {
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirementIds: [id] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      const u = data.updated?.[0] as Req | undefined;
      if (u) update(u.id, { draft: u.draft, status: u.status });
      if (data.errors?.length) setError(data.errors[0].error);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  async function saveDraft(id: string, draft: string, status: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/requirements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      update(id, { draft, status });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  async function toggleUnsure(r: Req) {
    const next = r.status === "unsure" ? "edited" : "unsure";
    await saveDraft(r.id, r.draft, next);
  }

  const draftedCount = reqs.filter((r) => r.draft.trim().length > 0).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
          <div className="text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">
              {draftedCount}/{reqs.length}
            </span>{" "}
            requirements drafted
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => generateAll(false)} disabled={generating}>
              {generating ? "Generating..." : "Generate missing drafts"}
            </Button>
            <Button
              variant="outline"
              onClick={() => generateAll(true)}
              disabled={generating}
            >
              Regenerate all
            </Button>
            <a href={`/api/proposals/${proposalId}/export`}>
              <Button variant="secondary">Export .docx</Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="rounded-md bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger-soft-fg)]">{error}</p>
      )}

      {reqs.map((r, i) => (
        <Card key={r.id}>
          <CardContent className="space-y-3 pt-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-[var(--text-primary)]">
                {i + 1}. {r.prompt}
              </h3>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                  statusStyles[r.status] ?? statusStyles.pending
                )}
              >
                {r.status}
              </span>
            </div>

            <Textarea
              value={r.draft}
              onChange={(e) => update(r.id, { draft: e.target.value })}
              placeholder="No draft yet. Click Draft to generate one."
              rows={7}
            />

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateOne(r.id)}
                disabled={busyId === r.id || generating}
              >
                {busyId === r.id ? "Working..." : r.draft ? "Redraft" : "Draft"}
              </Button>
              <Button
                size="sm"
                onClick={() => saveDraft(r.id, r.draft, "edited")}
                disabled={busyId === r.id}
              >
                Save edit
              </Button>
              <Button
                size="sm"
                variant={r.status === "unsure" ? "destructive" : "ghost"}
                onClick={() => toggleUnsure(r)}
                disabled={busyId === r.id}
              >
                {r.status === "unsure" ? "Clear unsure flag" : "Mark unsure"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
