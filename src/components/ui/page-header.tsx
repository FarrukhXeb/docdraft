import * as React from "react";

export interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Small "back" link rendered above the title. */
  back?: React.ReactNode;
}

/**
 * Page heading block: title, supporting sentence, right-aligned actions.
 * Every app screen opens with this (`space-y-6` above the content).
 */
export function PageHeader({
  title,
  description,
  actions,
  back,
  style,
  ...rest
}: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-6)",
        ...style,
      }}
      {...rest}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {back}
        <h1
          style={{
            margin: 0,
            font: "var(--type-page-title)",
            color: "var(--text-primary)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          {title}
        </h1>
        {description ? (
          <p
            style={{
              margin: "var(--space-2) 0 0",
              font: "var(--type-body)",
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              maxWidth: "64ch",
              textWrap: "pretty",
            }}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div style={{ display: "flex", gap: "var(--space-2)", flexShrink: 0 }}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}
