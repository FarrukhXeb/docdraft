import * as React from "react";
import { Icon } from "./icon";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  label?: React.ReactNode;
}

/** Checkbox with inline label — used for bulk-select in the compliance matrix. */
export function Checkbox({
  checked = false,
  label,
  onChange,
  disabled,
  id,
  style,
  ...rest
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        font: "var(--type-body)",
        color: "var(--text-body)",
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${checked ? "var(--primary)" : "var(--border-default)"}`,
          background: checked ? "var(--primary)" : "var(--surface-card)",
          color: "var(--primary-fg)",
          transition: "var(--transition-colors)",
        }}
      >
        {checked ? <Icon name="check" size={11} /> : null}
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      {label}
    </label>
  );
}
