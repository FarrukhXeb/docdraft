import * as React from "react";
import { Icon } from "./icon";

type ButtonVariant =
  | "primary"
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive";
type ButtonSize = "sm" | "default" | "lg";

const SIZES: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    height: "var(--h-control-sm)",
    padding: "0 12px",
    fontSize: "var(--text-xs)",
  },
  default: {
    height: "var(--h-control)",
    padding: "0 16px",
    fontSize: "var(--text-sm)",
  },
  lg: {
    height: "var(--h-control-lg)",
    padding: "0 24px",
    fontSize: "var(--text-sm)",
  },
};

const VARIANTS: Record<
  ButtonVariant,
  { cls: string; background: string; color: string; border: string }
> = {
  primary: {
    cls: "dd-btn-primary",
    background: "var(--primary)",
    color: "var(--primary-fg)",
    border: "1px solid transparent",
  },
  default: {
    cls: "dd-btn-neutral",
    background: "var(--neutral-solid)",
    color: "var(--text-inverse)",
    border: "1px solid transparent",
  },
  outline: {
    cls: "dd-btn-outline",
    background: "var(--surface-card)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-default)",
  },
  secondary: {
    cls: "dd-btn-secondary",
    background: "var(--surface-hover)",
    color: "var(--text-primary)",
    border: "1px solid transparent",
  },
  ghost: {
    cls: "dd-btn-ghost",
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid transparent",
  },
  destructive: {
    cls: "dd-btn-danger",
    background: "var(--danger)",
    color: "var(--danger-fg)",
    border: "1px solid transparent",
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Navy `primary` is the default; `default` is the slate-900 neutral variant. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading Lucide icon name. */
  icon?: string;
  /** Trailing Lucide icon name. */
  iconRight?: string;
  /** Swaps the leading icon for a spinner and disables the button. */
  loading?: boolean;
  fullWidth?: boolean;
}

/** Primary action control. Navy default, slate `default` variant, ported from the design system. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "default",
      icon,
      iconRight,
      loading = false,
      fullWidth = false,
      children,
      style,
      className = "",
      disabled,
      ...rest
    },
    ref
  ) => {
    const { cls, ...tone } = VARIANTS[variant] || VARIANTS.primary;
    return (
      <button
        ref={ref}
        className={`dd-btn dd-focus ${cls} ${className}`.trim()}
        disabled={disabled || loading}
        style={{
          display: fullWidth ? "flex" : "inline-flex",
          width: fullWidth ? "100%" : undefined,
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-2)",
          whiteSpace: "nowrap",
          borderRadius: "var(--radius-md)",
          fontWeight: "var(--weight-medium)",
          fontFamily: "var(--font-sans)",
          ...SIZES[size],
          ...tone,
          ...style,
        }}
        {...rest}
      >
        {loading ? (
          <Icon
            name="loader-circle"
            size={14}
            style={{ animation: "dd-spin 900ms linear infinite" }}
          />
        ) : icon ? (
          <Icon name={icon} size={size === "sm" ? 13 : 15} />
        ) : null}
        {children}
        {iconRight ? <Icon name={iconRight} size={size === "sm" ? 13 : 15} /> : null}
      </button>
    );
  }
);
Button.displayName = "Button";
