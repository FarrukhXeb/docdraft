import * as React from "react";

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: (TabItem | string)[];
  value?: string;
  onChange?: (value: string) => void;
}

/** Underlined tab strip for switching views within a screen. */
export function Tabs({ tabs = [], value, onChange, style, ...rest }: TabsProps) {
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        gap: "var(--space-5)",
        borderBottom: "1px solid var(--border-subtle)",
        ...style,
      }}
      {...rest}
    >
      {tabs.map((t) => {
        const id = typeof t === "string" ? t : t.value;
        const label = typeof t === "string" ? t : t.label;
        const count = typeof t === "string" ? undefined : t.count;
        const on = id === value;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange && onChange(id)}
            className="dd-btn dd-focus"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${on ? "var(--primary)" : "transparent"}`,
              padding: "0 0 10px",
              marginBottom: -1,
              font: "var(--type-label)",
              color: on ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            {label}
            {count != null ? (
              <span
                style={{
                  padding: "1px 6px",
                  borderRadius: "var(--radius-full)",
                  background: on ? "var(--primary-soft)" : "var(--surface-hover)",
                  color: on ? "var(--primary-soft-fg)" : "var(--text-muted)",
                  font: "var(--type-badge)",
                }}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
