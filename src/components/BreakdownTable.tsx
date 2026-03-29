"use client";

import type { BreakdownItem } from "@/lib/types";
import { formatYen } from "@/lib/format";
import { Tooltip } from "./Tooltip";

interface BreakdownTableProps {
  items: BreakdownItem[];
  highlightColor?: string;
}

export function BreakdownTable({ items, highlightColor = "bg-blue-600" }: BreakdownTableProps) {
  return (
    <div className="divide-y divide-slate-100">
      {items.map((item, index) => (
        <div
          key={`${index}-${item.label}`}
          className={`flex justify-between items-center py-2 px-1 ${
            item.isReference
              ? "bg-slate-50 rounded-lg px-3 py-2 mt-3 border border-slate-200"
              : item.isHighlight
              ? `${highlightColor} rounded-lg px-3 py-3 mt-2`
              : item.isSubtotal
              ? "font-semibold"
              : "text-slate-600"
          }`}
        >
          <span
            className={`text-sm ${
              item.isReference
                ? "text-slate-600"
                : item.isHighlight
                ? "text-white text-base font-bold"
                : ""
            }`}
          >
            {item.label}
            {item.tooltip && <Tooltip text={item.tooltip} />}
          </span>
          <span
            className={`font-mono text-sm ${
              item.isReference
                ? "text-slate-600"
                : item.isHighlight
                ? "text-white text-lg font-bold"
                : item.amount < 0
                ? "text-rose-500"
                : ""
            }`}
          >
            {item.amount < 0 ? `-${formatYen(Math.abs(item.amount))}` : formatYen(item.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
