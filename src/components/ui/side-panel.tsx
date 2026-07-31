import * as React from "react";
import { IconButton } from "./icon-button";

export interface SidePanelProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  open?: boolean;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
  width?: number | string;
}

/**
 * Right-hand slide-over for add/edit forms (Answer Library entries). Adapted
 * from the design kit to `position: fixed` so it covers the viewport.
 */
export function SidePanel({
  open = true,
  title,
  subtitle,
  onClose,
  footer,
  width = 460,
  children,
  style,
  ...rest
}: SidePanelProps) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 40,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--scrim)",
          animation: "dd-fade-in var(--dur-base) var(--ease-out)",
        }}
      />
      <aside
        role="dialog"
        aria-label={typeof title === "string" ? title : undefined}
        style={{
          position: "relative",
          width,
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          background: "var(--surface-card)",
          borderLeft: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-overlay)",
          animation: "dd-fade-in var(--dur-slow) var(--ease-out)",
          ...style,
        }}
        {...rest}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--space-4)",
            padding: "var(--space-5)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                font: "var(--type-section-title)",
                color: "var(--text-primary)",
              }}
            >
              {title}
            </h2>
            {subtitle ? (
              <p
                style={{
                  margin: "2px 0 0",
                  font: "var(--type-body)",
                  color: "var(--text-muted)",
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
          {onClose ? (
            <IconButton icon="x" label="Close" size="sm" onClick={onClose} />
          ) : null}
        </div>
        <div
          className="dd-scroll"
          style={{ flex: 1, overflowY: "auto", padding: "var(--space-5)" }}
        >
          {children}
        </div>
        {footer ? (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--space-2)",
              padding: "var(--space-4) var(--space-5)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            {footer}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
