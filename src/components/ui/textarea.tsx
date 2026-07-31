import * as React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 1.7 line-height for long-form draft answers. */
  prose?: boolean;
  invalid?: boolean;
}

/**
 * Multi-line field for RFP requirements and drafted answers. Ported from
 * ui/textarea.tsx (min-height 80px, px-3 py-2); `prose` opts into 1.7
 * line-height for long text.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ rows = 5, prose = false, invalid = false, style, className = "", ...rest }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={`dd-field dd-scroll ${className}`.trim()}
      aria-invalid={invalid || undefined}
      style={{
        width: "100%",
        minHeight: 80,
        borderRadius: "var(--radius-md)",
        border: `1px solid ${invalid ? "var(--danger)" : "var(--border-default)"}`,
        background: "var(--surface-card)",
        color: "var(--text-body)",
        padding: "var(--space-2) var(--pad-control-x)",
        font: prose ? "var(--type-prose)" : "var(--type-body)",
        boxShadow: "var(--shadow-xs)",
        resize: "vertical",
        ...style,
      }}
      {...rest}
    />
  )
);
Textarea.displayName = "Textarea";
