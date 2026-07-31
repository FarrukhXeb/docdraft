"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NewProposalForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          companyName: companyName || undefined,
          companyInfo: companyInfo || undefined,
          requirementsText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create proposal");
      router.push(`/proposals/${data.proposal.id}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Start a proposal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="title">Proposal title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. City of Springfield IT Services RFP"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyName">Your company name (optional)</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyInfo">Company context (optional)</Label>
            <Textarea
              id="companyInfo"
              value={companyInfo}
              onChange={(e) => setCompanyInfo(e.target.value)}
              placeholder="A short profile the AI can use: who you are, size, differentiators..."
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="requirements">RFP requirements</Label>
            <Textarea
              id="requirements"
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder={
                "Paste the solicitation questions, one per line:\n" +
                "Describe your data security practices.\n" +
                "Summarize relevant past performance.\n" +
                "What is your implementation timeline?"
              }
              rows={8}
              required
            />
            <p className="text-xs text-slate-500">
              One requirement per line. Numbered or bulleted lines are cleaned up
              automatically.
            </p>
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create proposal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
