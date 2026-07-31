import * as React from "react";
import { Icon } from "./icon";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  label?: React.ReactNode;
}

/** Spinning loader glyph for in-flight generation. */
export function Spinner({ size = 16, label, style, ...rest }: SpinnerProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        color: "var(--text-muted)",
        font: "var(--type-body)",
        ...style,
      }}
      {...rest}
    >
      <Icon
        name="loader-circle"
        size={size}
        style={{ animation: "dd-spin 900ms linear infinite" }}
      />
      {label}
    </span>
  );
}
