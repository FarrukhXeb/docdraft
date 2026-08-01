import * as React from "react";
import { Logo } from "./logo";
import { Button } from "./button";
import { Icon } from "./icon";

export interface NavLink {
  href?: string;
  label: string;
  icon?: string;
}

export interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links?: NavLink[];
  /** href or label of the current link. */
  active?: string;
  userEmail?: string;
  onNavigate?: (link: NavLink) => void;
  onSignOut?: () => void;
  /** Extra controls left of the email (e.g. theme toggle). */
  right?: React.ReactNode;
  maxWidth?: number | string;
}

/** App header: wordmark, pill nav links, user email, sign-out. Ported from src/components/nav.tsx. */
export function TopNav({
  links = [],
  active,
  userEmail,
  onNavigate,
  onSignOut,
  right,
  maxWidth = "var(--width-app)",
  style,
  ...rest
}: TopNavProps) {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--surface-card)",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-6)",
          padding: "var(--space-3) var(--gutter-page)",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}
        >
          <Logo />
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-1)",
            }}
          >
            {links.map((l) => {
              const on = l.href === active || l.label === active;
              return (
                <button
                  key={l.href ?? l.label}
                  onClick={() => onNavigate && onNavigate(l)}
                  aria-current={on ? "page" : undefined}
                  className="dd-btn dd-focus dd-btn-ghost"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid transparent",
                    padding: "6px 12px",
                    font: "var(--type-label)",
                    background: on ? "var(--surface-hover)" : "transparent",
                    color: on ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {l.icon ? <Icon name={l.icon} size={14} /> : null}
                  {l.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
        >
          {right}
          {userEmail ? (
            <span
              style={{ font: "var(--type-body)", color: "var(--text-muted)" }}
            >
              {userEmail}
            </span>
          ) : null}
          {onSignOut ? (
            <Button
              variant="outline"
              size="sm"
              icon="log-out"
              onClick={onSignOut}
            >
              Sign out
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
