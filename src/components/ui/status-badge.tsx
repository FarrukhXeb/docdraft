import * as React from "react";
import { Badge } from "./badge";

export type RequirementStatus =
  | "pending"
  | "drafted"
  | "edited"
  | "unsure"
  | "exported";

const MAP: Record<
  RequirementStatus,
  {
    label: string;
    tone: "neutral" | "info" | "success" | "warning" | "brand";
    icon: string;
  }
> = {
  pending: { label: "Pending", tone: "neutral", icon: "clock" },
  drafted: { label: "Drafted", tone: "info", icon: "sparkles" },
  edited: { label: "Edited", tone: "success", icon: "check" },
  unsure: { label: "Unsure", tone: "warning", icon: "flag" },
  exported: { label: "Exported", tone: "brand", icon: "download" },
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  status?: RequirementStatus;
  showIcon?: boolean;
}

/**
 * Review-status pill for a requirement or proposal. Statuses match the Prisma
 * `Requirement.status` values (pending / drafted / edited / unsure), plus
 * `exported`. The word always accompanies the colour — status is never encoded
 * by colour alone.
 */
export function StatusBadge({
  status = "pending",
  showIcon = true,
  style,
  ...rest
}: StatusBadgeProps) {
  const s = MAP[status] || MAP.pending;
  return (
    <Badge
      tone={s.tone}
      icon={showIcon ? s.icon : undefined}
      style={style}
      {...rest}
    >
      {s.label}
    </Badge>
  );
}
