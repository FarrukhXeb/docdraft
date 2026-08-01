"use client";

import { useState } from "react";
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

export interface LibEntry {
  id: string;
  topic: string;
  content: string;
  tags: string | null;
}

export function LibraryManager({
  initialEntries,
}: {
  initialEntries: LibEntry[];
}) {
  const [entries, setEntries] = useState<LibEntry[]>(initialEntries);
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setTopic("");
    setContent("");
    setTags("");
    setEditingId(null);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = { topic, content, tags: tags || undefined };
      const res = await fetch(
        editingId ? `/api/library/${editingId}` : "/api/library",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      if (editingId) {
        setEntries((prev) =>
          prev.map((x) => (x.id === editingId ? data.entry : x))
        );
      } else {
        setEntries((prev) => [data.entry, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(entry: LibEntry) {
    setEditingId(entry.id);
    setTopic(entry.topic);
    setContent(entry.content);
    setTags(entry.tags ?? "");
    setError(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this entry?")) return;
    const res = await fetch(`/api/library/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEntries((prev) => prev.filter((x) => x.id !== id));
      if (editingId === id) resetForm();
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{editingId ? "Edit entry" : "Add entry"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="topic">Topic / question</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Data security practices"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Approved answer</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="The company-approved boilerplate for this topic..."
                rows={7}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="security, compliance"
              />
            </div>
            {error && <p className="text-sm text-[var(--danger-soft-fg)]">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update" : "Add"}
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {entries.length === 0 && (
          <p className="text-[var(--text-muted)]">
            No entries yet. Add your first approved answer on the left.
          </p>
        )}
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {entry.topic}
                  </h3>
                  {entry.tags && (
                    <p className="text-xs text-[var(--text-muted)]">{entry.tags}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(entry)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(entry.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--text-body)]">
                {entry.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
