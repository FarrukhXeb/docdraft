import * as React from "react";

export interface TableColumn<Row = Record<string, unknown>> {
  key: string;
  header: React.ReactNode;
  width?: number | string;
  align?: "left" | "center" | "right";
  render?: (row: Row) => React.ReactNode;
}

export interface TableProps<Row = Record<string, unknown>>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  columns: TableColumn<Row>[];
  rows: Row[];
  onRowClick?: (row: Row) => void;
  /** Rendered in a full-width cell when rows is empty. */
  empty?: React.ReactNode;
}

/**
 * Data table for proposal lists. Plain semantic table styled with tokens;
 * rows separated by rules, uppercase 12px headers.
 */
export function Table<Row extends { id?: string | number } = Record<string, unknown>>({
  columns = [],
  rows = [],
  onRowClick,
  empty,
  style,
  ...rest
}: TableProps<Row>) {
  return (
    <div style={{ width: "100%", overflowX: "auto", ...style }} {...rest}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          font: "var(--type-body)",
        }}
      >
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align || "left",
                  padding: "var(--space-2) var(--space-4)",
                  width: c.width,
                  font: "var(--type-meta)",
                  fontWeight: "var(--weight-medium)",
                  letterSpacing: "var(--tracking-wide)",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  borderBottom: "1px solid var(--border-subtle)",
                  whiteSpace: "nowrap",
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && empty ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: "var(--space-8) var(--space-4)" }}
              >
                {empty}
              </td>
            </tr>
          ) : null}
          {rows.map((r, i) => (
            <tr
              key={r.id ?? i}
              className={onRowClick ? "dd-row" : ""}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
              style={{
                cursor: onRowClick ? "pointer" : undefined,
                borderBottom:
                  i === rows.length - 1
                    ? "none"
                    : "1px solid var(--border-subtle)",
              }}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    textAlign: c.align || "left",
                    padding: "var(--space-3) var(--space-4)",
                    color: "var(--text-body)",
                    verticalAlign: "middle",
                  }}
                >
                  {c.render
                    ? c.render(r)
                    : (r as Record<string, React.ReactNode>)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
