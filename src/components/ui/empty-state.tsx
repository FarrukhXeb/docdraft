import * as React from "react";
import { Icon } from "./icon";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  compact?: boolean;
}

/** Centered zero-state: glyph, headline, one calm sentence, one primary action. */
export function EmptyState({
  icon = "file-text",
  title,
  description,
  action,
  compact = false,
  style,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "var(--space-2)",
        padding: compact
          ? "var(--space-8) var(--space-6)"
          : "var(--space-12) var(--space-6)",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "var(--radius-lg)",
          background: "var(--surface-hover)",
          color: "var(--text-muted)",
          marginBottom: "var(--space-1)",
        }}
      >
        <Icon name={icon} size={19} />
      </span>
      <p
        style={{ margin: 0, font: "var(--type-card-title)", color: "var(--text-primary)" }}
      >
        {title}
      </p>
      {description ? (
        <p
          style={{
            margin: 0,
            maxWidth: 380,
            font: "var(--type-body)",
            color: "var(--text-muted)",
            textWrap: "pretty",
          }}
        >
          {description}
        </p>
      ) : null}
      {action ? <div style={{ marginTop: "var(--space-3)" }}>{action}</div> : null}
    </div>
  );
}
