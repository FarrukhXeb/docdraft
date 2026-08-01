import * as React from "react";
import { Icon } from "./icon";

type AlertTone = "info" | "success" | "warning" | "danger";

const ALERT_TONES: Record<AlertTone, { bg: string; fg: string; icon: string }> = {
  info: {
    bg: "var(--status-drafted-bg)",
    fg: "var(--status-drafted-fg)",
    icon: "info",
  },
  success: {
    bg: "var(--status-edited-bg)",
    fg: "var(--status-edited-fg)",
    icon: "circle-check-big",
  },
  warning: {
    bg: "var(--status-unsure-bg)",
    fg: "var(--status-unsure-fg)",
    icon: "triangle-alert",
  },
  danger: {
    bg: "var(--danger-soft)",
    fg: "var(--danger-soft-fg)",
    icon: "triangle-alert",
  },
};

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * Inline message banner. The app's error pattern: soft tinted panel, 6px
 * radius, 14px text — never a floating toast.
 */
export function Alert({
  tone = "info",
  title,
  children,
  action,
  style,
  ...rest
}: AlertProps) {
  const t = ALERT_TONES[tone] || ALERT_TONES.info;
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        padding: "var(--space-3) var(--space-4)",
        borderRadius: "var(--radius-md)",
        background: t.bg,
        color: t.fg,
        font: "var(--type-body)",
        ...style,
      }}
      {...rest}
    >
      <Icon name={t.icon} size={16} style={{ marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? (
          <p style={{ margin: 0, fontWeight: "var(--weight-semibold)" }}>
            {title}
          </p>
        ) : null}
        {children ? (
          <div style={{ marginTop: title ? 2 : 0 }}>{children}</div>
        ) : null}
      </div>
      {action}
    </div>
  );
}
