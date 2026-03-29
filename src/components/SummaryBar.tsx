"use client";

import { formatYen, formatPercent } from "@/lib/format";
import { Tooltip } from "./Tooltip";

interface SummaryBarProps {
  takeHomePay: number;
  effectiveTaxRate: number;
  colorClass?: string;
}

export function SummaryBar({
  takeHomePay,
  effectiveTaxRate,
  colorClass = "bg-blue-600",
}: SummaryBarProps) {
  return (
    <div className={`rounded-xl p-4 text-white ${colorClass}`}>
      <div className="text-sm opacity-80">手取り額（年間）</div>
      <div className="text-2xl font-bold font-mono mt-1">
        {formatYen(takeHomePay)}
      </div>
      <div className="text-sm opacity-80 mt-1 flex items-center flex-wrap">
        <span>月額: {formatYen(Math.floor(takeHomePay / 12))} ／ 実効負担率: {formatPercent(effectiveTaxRate)}</span>
        <Tooltip text="額面収入に対して、税金・社会保険料が占める割合です。正社員は年収、業務委託は年間売上が分母になります。この数値が低いほど手元に残る割合が大きいことを意味します。" />
      </div>
    </div>
  );
}
