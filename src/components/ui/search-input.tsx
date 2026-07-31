import * as React from "react";
import { Icon } from "./icon";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/** Input with a leading search glyph — the Answer Library filter control. */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = "Search…", style, className = "", ...rest }, ref) => (
    <span style={{ position: "relative", display: "block", ...style }}>
      <Icon
        name="search"
        size={15}
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          marginTop: -8,
          color: "var(--text-muted)",
          pointerEvents: "none",
        }}
      />
      <input
        ref={ref}
        type="search"
        placeholder={placeholder}
        className={`dd-field ${className}`.trim()}
        style={{
          width: "100%",
          height: "var(--h-control)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-default)",
          background: "var(--surface-card)",
          color: "var(--text-primary)",
          padding: "0 var(--pad-control-x) 0 32px",
          font: "var(--type-body)",
          boxShadow: "var(--shadow-xs)",
        }}
        {...rest}
      />
    </span>
  )
);
SearchInput.displayName = "SearchInput";
