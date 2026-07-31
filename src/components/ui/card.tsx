import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds the hover border-darkening used by clickable list cards. */
  interactive?: boolean;
}

/** Surface container: 1px subtle border, 8px radius, shadow-sm. Ported from ui/card.tsx. */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, style, className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={`${interactive ? "dd-card-link" : ""} ${className}`.trim()}
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

/** Card header block — p-5, stacked title/description. */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ style, children, ...rest }, ref) => (
  <div
    ref={ref}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1)",
      padding: "var(--pad-card)",
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: React.ElementType;
}

/** Semibold card title (16px). */
export const CardTitle = ({
  as: As = "h3",
  style,
  children,
  ...rest
}: CardTitleProps) => (
  <As
    style={{
      margin: 0,
      font: "var(--type-card-title)",
      color: "var(--text-primary)",
      ...style,
    }}
    {...rest}
  >
    {children}
  </As>
);
CardTitle.displayName = "CardTitle";

/** Muted one-line description under a CardTitle. */
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ style, children, ...rest }, ref) => (
  <p
    ref={ref}
    style={{
      margin: 0,
      font: "var(--type-body)",
      color: "var(--text-muted)",
      ...style,
    }}
    {...rest}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

/** Card body — p-5 with the header's top padding removed. */
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ style, children, ...rest }, ref) => (
  <div
    ref={ref}
    style={{ padding: "var(--pad-card)", paddingTop: 0, ...style }}
    {...rest}
  >
    {children}
  </div>
));
CardContent.displayName = "CardContent";

/** Optional footer strip, separated by a subtle rule. */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ style, children, ...rest }, ref) => (
  <div
    ref={ref}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "var(--pad-card)",
      borderTop: "1px solid var(--border-subtle)",
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
));
CardFooter.displayName = "CardFooter";
