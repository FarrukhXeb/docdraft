import * as React from "react";
import { IconButton } from "./icon-button";

export interface DialogProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
  width?: number | string;
}

/**
 * Centered modal over a scrim. Used for destructive confirms and export
 * success. Adapted from the design kit to `position: fixed` so it covers the
 * viewport in the real app.
 */
export function Dialog({
  open = true,
  title,
  description,
  onClose,
  footer,
  width = 460,
  children,
  style,
  ...rest
}: DialogProps) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-6)",
        background: "var(--scrim)",
        backdropFilter: "blur(var(--blur-overlay))",
        animation: "dd-fade-in var(--dur-base) var(--ease-out)",
        zIndex: 40,
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: "100%",
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-overlay)",
          animation: "dd-rise var(--dur-slow) var(--ease-out)",
          ...style,
        }}
        {...rest}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--space-4)",
            padding: "var(--space-5) var(--space-5) 0",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {title ? (
              <h2
                style={{
                  margin: 0,
                  font: "var(--type-section-title)",
                  color: "var(--text-primary)",
                }}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                style={{
                  margin: "var(--space-2) 0 0",
                  font: "var(--type-body)",
                  color: "var(--text-muted)",
                  textWrap: "pretty",
                }}
              >
                {description}
              </p>
            ) : null}
          </div>
          {onClose ? (
            <IconButton icon="x" label="Close" size="sm" onClick={onClose} />
          ) : null}
        </div>
        {children ? (
          <div style={{ padding: "var(--space-4) var(--space-5) 0" }}>
            {children}
          </div>
        ) : null}
        {footer ? (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--space-2)",
              padding: "var(--space-5)",
            }}
          >
            {footer}
          </div>
        ) : (
          <div style={{ height: "var(--space-5)" }} />
        )}
      </div>
    </div>
  );
}
