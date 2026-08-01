import * as React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

/** Form label — 14px medium, tight leading. Ported from ui/label.tsx. */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ required = false, style, children, ...rest }, ref) => (
    <label
      ref={ref}
      style={{
        font: "var(--type-label)",
        color: "var(--text-primary)",
        ...style,
      }}
      {...rest}
    >
      {children}
      {required ? <span style={{ color: "var(--danger)" }}> *</span> : null}
    </label>
  )
);
Label.displayName = "Label";
