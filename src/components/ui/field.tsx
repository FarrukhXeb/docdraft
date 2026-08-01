import * as React from "react";
import { Label } from "./label";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  /** Replaces the hint and tints it danger. */
  error?: React.ReactNode;
  required?: boolean;
}

/** Label + control + hint/error wrapper. Encodes the app's `space-y-1.5` field rhythm. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  style,
  children,
  ...rest
}: FieldProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1)",
        ...style,
      }}
      {...rest}
    >
      {label ? (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      ) : null}
      <div style={{ marginTop: 2 }}>{children}</div>
      {error ? (
        <p
          style={{
            margin: 0,
            font: "var(--type-meta)",
            color: "var(--danger-soft-fg)",
          }}
        >
          {error}
        </p>
      ) : hint ? (
        <p
          style={{
            margin: 0,
            font: "var(--type-meta)",
            color: "var(--text-muted)",
          }}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
