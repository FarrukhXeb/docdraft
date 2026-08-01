"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = isRegister
        ? await signUp.email({ name, email, password })
        : await signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message ?? "Authentication failed.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-6)",
        padding: "var(--space-12) var(--gutter-page)",
        background: "var(--surface-app)",
      }}
    >
      <div
        style={{
          width: "var(--width-form)",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <Logo size="lg" />
          <p
            style={{
              margin: 0,
              font: "var(--type-body)",
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              textAlign: "center",
              textWrap: "pretty",
            }}
          >
            Draft RFP and proposal responses in minutes.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "var(--text-xl)" }}>
              {isRegister ? "Create your account" : "Welcome back"}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? "Your answer library stays private to your firm."
                : "Sign in to your proposals and answer library."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={onSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
              }}
            >
              {isRegister && (
                <Field label="Name" htmlFor="name">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </Field>
              )}
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </Field>
              <Field
                label="Password"
                htmlFor="password"
                hint={isRegister ? "At least 8 characters." : undefined}
              >
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                />
              </Field>

              {error && <Alert tone="danger">{error}</Alert>}

              <Button type="submit" fullWidth loading={loading}>
                {isRegister ? "Create account" : "Log in"}
              </Button>
            </form>

            <p
              style={{
                margin: "var(--space-4) 0 0",
                textAlign: "center",
                font: "var(--type-body)",
                color: "var(--text-secondary)",
              }}
            >
              {isRegister ? "Already have an account? " : "Need an account? "}
              <Link
                href={isRegister ? "/login" : "/register"}
                style={{ fontWeight: "var(--weight-medium)" }}
              >
                {isRegister ? "Log in" : "Register"}
              </Link>
            </p>
          </CardContent>
        </Card>

        <p
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-2)",
            font: "var(--type-meta)",
            color: "var(--text-muted)",
          }}
        >
          <Icon name="settings" size={12} /> Your drafts and library never leave
          your workspace.
        </p>
      </div>
    </main>
  );
}
