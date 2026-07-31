import * as React from "react";
import { Card } from "./card";
import { Icon } from "./icon";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  caption?: React.ReactNode;
  icon?: string;
  /** Wraps the card in a link and enables the hover border. */
  href?: string;
}

/**
 * Dashboard metric tile: label, big number, unit caption. From the app's
 * dashboard cards (Answer Library / Proposals counts).
 */
export function StatCard({
  label,
  value,
  caption,
  icon,
  href,
  style,
  ...rest
}: StatCardProps) {
  const body = (
    <Card
      interactive={!!href}
      style={{ display: "block", padding: "var(--pad-card)", ...style }}
      {...rest}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-3)",
        }}
      >
        <span
          style={{ font: "var(--type-card-title)", color: "var(--text-primary)" }}
        >
          {label}
        </span>
        {icon ? (
          <Icon name={icon} size={16} style={{ color: "var(--text-muted)" }} />
        ) : null}
      </div>
      <p
        style={{
          margin: "var(--space-4) 0 0",
          fontSize: "var(--text-3xl)",
          fontWeight: "var(--weight-bold)",
          lineHeight: 1,
          color: "var(--text-primary)",
        }}
      >
        {value}
      </p>
      {caption ? (
        <p
          style={{
            margin: "var(--space-2) 0 0",
            font: "var(--type-body)",
            color: "var(--text-muted)",
          }}
        >
          {caption}
        </p>
      ) : null}
    </Card>
  );
  return href ? (
    <a href={href} style={{ display: "block", textDecoration: "none" }}>
      {body}
    </a>
  ) : (
    body
  );
}
