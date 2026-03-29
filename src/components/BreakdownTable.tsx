"use client";

import type { BreakdownItem } from "@/lib/types";
import { formatYen } from "@/lib/format";
import { Tooltip } from "./Tooltip";

interface BreakdownTableProps {
  items: BreakdownItem[];
}

export function BreakdownTable({ items }: BreakdownTableProps) {
  return (
    <div className="divide-y divide-gray-100">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex justify-between py-2 px-1 ${
            item.isHighlight
              ? "bg-blue-50 rounded-lg px-3 py-3 mt-2"
              : item.isSubtotal
              ? "font-semibold"
              : "text-gray-600"
          }`}
        >
          <span
            className={`text-sm ${
              item.isHighlight ? "text-blue-900 text-base font-bold" : ""
            }`}
          >
            {item.label}
            {item.tooltip && <Tooltip text={item.tooltip} />}
          </span>
          <span
            className={`font-mono text-sm ${
              item.isHighlight
                ? "text-blue-900 text-lg font-bold"
                : item.amount < 0
                ? "text-red-600"
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
