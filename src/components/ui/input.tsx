import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

/** Single-line text field. Mirrors ui/input.tsx (h-9, 6px radius, 2px focus ring). */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ invalid = false, style, className = "", ...rest }, ref) => (
    <input
      ref={ref}
      className={`dd-field ${className}`.trim()}
      aria-invalid={invalid || undefined}
      style={{
        width: "100%",
        height: "var(--h-control)",
        borderRadius: "var(--radius-md)",
        border: `1px solid ${invalid ? "var(--danger)" : "var(--border-default)"}`,
        background: "var(--surface-card)",
        color: "var(--text-primary)",
        padding: "0 var(--pad-control-x)",
        font: "var(--type-body)",
        boxShadow: "var(--shadow-xs)",
        ...style,
      }}
      {...rest}
    />
  )
);
Input.displayName = "Input";
