import * as React from "react";
import { Icon } from "./icon";

const BOX: Record<string, number> = { sm: 32, default: 36, lg: 40 };

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  /** Required accessible label (also the tooltip). */
  label: string;
  variant?: "ghost" | "outline" | "primary";
  size?: "sm" | "default" | "lg";
}

/** Square icon-only button — the `size="icon"` case of the app's Button. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon, label, variant = "ghost", size = "default", style, className = "", ...rest },
    ref
  ) => {
    const box = BOX[size] || BOX.default;
    const tone =
      variant === "outline"
        ? {
            cls: "dd-btn-outline",
            background: "var(--surface-card)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
          }
        : variant === "primary"
          ? {
              cls: "dd-btn-primary",
              background: "var(--primary)",
              border: "1px solid transparent",
              color: "var(--primary-fg)",
            }
          : {
              cls: "dd-btn-ghost",
              background: "transparent",
              border: "1px solid transparent",
              color: "var(--text-secondary)",
            };
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={`dd-btn dd-focus ${tone.cls} ${className}`.trim()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: box,
          height: box,
          borderRadius: "var(--radius-md)",
          background: tone.background,
          border: tone.border,
          color: tone.color,
          ...style,
        }}
        {...rest}
      >
        <Icon name={icon} size={size === "sm" ? 14 : 16} />
      </button>
    );
  }
);
IconButton.displayName = "IconButton";
