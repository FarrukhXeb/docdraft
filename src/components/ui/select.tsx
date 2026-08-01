import * as React from "react";
import { Icon } from "./icon";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: (SelectOption | string)[];
}

/** Native select styled to match Input, with a chevron affordance. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options = [], style, className = "", ...rest }, ref) => (
    <span style={{ position: "relative", display: "block", ...style }}>
      <select
        ref={ref}
        className={`dd-field ${className}`.trim()}
        style={{
          width: "100%",
          height: "var(--h-control)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-default)",
          background: "var(--surface-card)",
          color: "var(--text-primary)",
          padding: "0 32px 0 var(--pad-control-x)",
          font: "var(--type-body)",
          boxShadow: "var(--shadow-xs)",
          appearance: "none",
        }}
        {...rest}
      >
        {options.map((o) => {
          const value = typeof o === "string" ? o : o.value;
          const label = typeof o === "string" ? o : o.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      <Icon
        name="chevron-down"
        size={14}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          marginTop: -7,
          color: "var(--text-muted)",
          pointerEvents: "none",
        }}
      />
    </span>
  )
);
Select.displayName = "Select";
