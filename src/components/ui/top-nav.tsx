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
        className="dd-top-nav-inner"
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
          className="dd-top-nav-primary"
          style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}
        >
          <Logo />
          <nav
            data-tour="primary-nav"
            aria-label="Primary navigation"
            className="dd-top-nav-links"
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
                  <span className="dd-top-nav-link-label">{l.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div
          className="dd-top-nav-actions"
          style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
        >
          {right}
          {userEmail ? (
            <span
              className="dd-top-nav-email"
              style={{ font: "var(--type-body)", color: "var(--text-muted)" }}
            >
              {userEmail}
            </span>
          ) : null}
          {onSignOut ? (
            <Button
              aria-label="Sign out"
              variant="outline"
              size="sm"
              icon="log-out"
              onClick={onSignOut}
            >
              <span className="dd-top-nav-signout-label">Sign out</span>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
