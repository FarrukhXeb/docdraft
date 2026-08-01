import * as React from "react";
import { Icon } from "./icon";

type BadgeTone =
  | "neutral"
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "danger";

const BADGE_TONES: Record<BadgeTone, { background: string; color: string }> = {
  neutral: { background: "var(--surface-hover)", color: "var(--text-secondary)" },
  brand: { background: "var(--primary-soft)", color: "var(--primary-soft-fg)" },
  info: {
    background: "var(--status-drafted-bg)",
    color: "var(--status-drafted-fg)",
  },
  success: {
    background: "var(--status-edited-bg)",
    color: "var(--status-edited-fg)",
  },
  warning: {
    background: "var(--status-unsure-bg)",
    color: "var(--status-unsure-fg)",
  },
  danger: { background: "var(--danger-soft)", color: "var(--danger-soft-fg)" },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: string;
  outline?: boolean;
}

/** Small pill label. Rounded-full, 12px medium — as used for requirement status. */
export function Badge({
  tone = "neutral",
  icon,
  outline = false,
  style,
  children,
  ...rest
}: BadgeProps) {
  const t = BADGE_TONES[tone] || BADGE_TONES.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        padding: "2px 8px",
        borderRadius: "var(--radius-full)",
        font: "var(--type-badge)",
        whiteSpace: "nowrap",
        background: outline ? "transparent" : t.background,
        color: t.color,
        border: outline ? `1px solid ${t.color}` : "1px solid transparent",
        ...style,
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size={11} /> : null}
      {children}
    </span>
  );
}
