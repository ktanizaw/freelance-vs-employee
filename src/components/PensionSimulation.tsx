"use client";

import { formatYen } from "@/lib/format";
import { Tooltip } from "./Tooltip";

interface PensionData {
  age: number;
  remainingYears: number;
  employee: {
    annualPayment: number;
    totalPaid: number;
    annualBenefit: number;
  };
  freelancer: {
    annualPayment: number;
    totalPaid: number;
    annualBenefit: number;
  };
}

interface PensionSimulationProps {
  data: PensionData;
}

export function PensionSimulation({ data }: PensionSimulationProps) {
  const { age, remainingYears, employee, freelancer } = data;
  const benefitDiff = employee.annualBenefit - freelancer.annualBenefit;

  return (
    <div className="mt-8 bg-white border border-slate-200 border-l-4 border-l-blue-500 shadow-sm rounded-xl p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1 flex items-center">
        年金シミュレーション（参考）
        <Tooltip text="現在の年齢から65歳までの期間で、過去の加入実績は含まれていません。現在の年収が65歳まで続くと仮定した場合の簡易計算です。" />
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        現在{age}歳 → 65歳まで残り{remainingYears}年加入した場合
      </p>

      <div>
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-300">
              <th className="text-left py-2 pr-2 sm:pr-4 text-slate-600 font-semibold" />
              <th className="text-right py-2 px-1 sm:px-4 text-blue-600 font-semibold">正社員</th>
              <th className="text-right py-2 pl-1 sm:pl-4 text-emerald-600 font-semibold">個人事業主</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-slate-100">
              <td className="py-2 pr-2 sm:pr-4">年間支払額</td>
              <td className="text-right py-2 px-1 sm:px-4 font-mono">
                {formatYen(employee.annualPayment)}
                <span className="block text-[10px] sm:text-xs text-gray-500">
                  (会社負担も同額)
                </span>
              </td>
              <td className="text-right py-2 pl-1 sm:pl-4 font-mono">{formatYen(freelancer.annualPayment)}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 pr-2 sm:pr-4">{remainingYears}年間の累計</td>
              <td className="text-right py-2 px-1 sm:px-4 font-mono">
                {formatYen(employee.totalPaid)}
                <span className="block text-[10px] sm:text-xs text-gray-500">
                  (会社負担含: {formatYen(employee.totalPaid * 2)})
                </span>
              </td>
              <td className="text-right py-2 pl-1 sm:pl-4 font-mono">{formatYen(freelancer.totalPaid)}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 pr-2 sm:pr-4 flex items-center">
                受給額／年
                <Tooltip text="終身で受給できる公的年金の額です。正社員は基礎年金＋報酬比例部分、個人事業主は基礎年金のみです。" />
              </td>
              <td className="text-right py-2 px-1 sm:px-4 font-mono font-semibold text-blue-600">
                {formatYen(employee.annualBenefit)}
              </td>
              <td className="text-right py-2 pl-1 sm:pl-4 font-mono font-semibold text-emerald-600">
                {formatYen(freelancer.annualBenefit)}
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-2 sm:pr-4 font-semibold text-slate-800">受給額の差／年</td>
              <td colSpan={2} className="text-right py-2 pl-1 sm:pl-4 font-mono font-bold text-slate-800">
                {benefitDiff > 0 ? `+${formatYen(benefitDiff)}` : benefitDiff < 0 ? `-${formatYen(Math.abs(benefitDiff))}` : formatYen(0)}
                <span className="text-[10px] sm:text-xs font-normal ml-1">
                  {benefitDiff > 0 ? "（正社員が多い）" : benefitDiff < 0 ? "（個人事業主が多い）" : "（同額）"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
