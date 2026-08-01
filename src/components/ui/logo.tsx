import * as React from "react";

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  /** Show the navy mark beside the wordmark. Default true. */
  withMark?: boolean;
  /** "inverse" for use on navy or dark surfaces (white plate, white text). */
  tone?: "default" | "inverse";
}

/**
 * DocDraft lockup: the mark (navy rounded square holding a drafted-document
 * glyph) plus the wordmark in the core sans. Geometry matches assets/logo.svg.
 */
export function Logo({
  size = "md",
  withMark = true,
  tone = "default",
  style,
  ...rest
}: LogoProps) {
  const fs = size === "lg" ? 26 : size === "sm" ? 16 : 18;
  const box = Math.round(fs * 1.45);
  const stroke = tone === "inverse" ? "var(--primary)" : "#ffffff";
  const plate = tone === "inverse" ? "#ffffff" : "var(--primary)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(fs * 0.45),
        fontFamily: "var(--font-sans)",
        fontSize: fs,
        fontWeight: "var(--weight-bold)",
        letterSpacing: "var(--tracking-tight)",
        color: tone === "inverse" ? "#ffffff" : "var(--text-primary)",
        ...style,
      }}
      {...rest}
    >
      {withMark ? (
        <svg
          width={box}
          height={box}
          viewBox="0 0 32 32"
          aria-hidden="true"
          focusable="false"
          style={{ flex: "0 0 auto", display: "block" }}
        >
          <rect width="32" height="32" rx="7" fill={plate} />
          <path
            d="M11.5 7.5H18L23.5 13v11.5h-12V7.5Z"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M18 7.5V13h5.5"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M14.5 17.5h6M14.5 20.75h4"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
      DocDraft
    </span>
  );
}
