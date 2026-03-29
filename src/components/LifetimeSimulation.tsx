"use client";

import { formatYen } from "@/lib/format";
import { Tooltip } from "./Tooltip";

interface LifetimeData {
  age: number;
  employee: {
    retirement: number;
    idecoFutureValue: number;
    pensionAnnualBenefit: number;
  };
  freelancer: {
    retirement: number;
    idecoFutureValue: number;
    pensionAnnualBenefit: number;
  };
}

interface LifetimeSimulationProps {
  data: LifetimeData;
}

const AGE_POINTS = [65, 75, 85, 95] as const;

function calcTotal(
  side: LifetimeData["employee"],
  agePoint: number
): number {
  const pensionYears = Math.max(0, agePoint - 65);
  return side.retirement + side.idecoFutureValue + side.pensionAnnualBenefit * pensionYears;
}

export function LifetimeSimulation({ data }: LifetimeSimulationProps) {
  const { age, employee, freelancer } = data;

  return (
    <div className="mt-4 bg-white border border-slate-200 border-l-4 border-l-slate-700 shadow-sm rounded-xl p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1 flex items-center">
        生涯収支シミュレーション（参考）
        <Tooltip text="年金・iDeCo・退職金/小規模企業共済の合計額を年齢別に比較します。現在の条件が65歳まで続くと仮定した簡易計算です。" />
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        現在{age}歳 → 各年齢時点での累計受取額
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
          <tbody className="text-slate-700">
            {AGE_POINTS.map((agePoint, i) => {
              const empTotal = calcTotal(employee, agePoint);
              const flTotal = calcTotal(freelancer, agePoint);
              const pensionYears = agePoint - 65;
              const label = pensionYears === 0
                ? "退職金 + iDeCo"
                : `+ 年金${pensionYears}年分`;

              return (
                <tr key={agePoint} className={i < AGE_POINTS.length - 1 ? "border-b border-slate-100" : ""}>
                  <td className="py-2.5 pr-2 sm:pr-4">
                    <span className="font-semibold">{agePoint}歳時点</span>
                    <span className="block text-[10px] sm:text-xs text-slate-400">{label}</span>
                  </td>
                  <td className="text-right py-2.5 px-1 sm:px-4 font-mono font-semibold text-blue-600">
                    {formatYen(empTotal)}
                  </td>
                  <td className="text-right py-2.5 pl-1 sm:pl-4 font-mono font-semibold text-emerald-600">
                    {formatYen(flTotal)}
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-slate-300">
              <td className="py-2.5 pr-2 sm:pr-4 font-bold text-slate-800">
                95歳時点の差額
              </td>
              <td colSpan={2} className="text-right py-2.5 pl-1 sm:pl-4 font-mono font-bold text-slate-800">
                {(() => {
                  const diff = calcTotal(employee, 95) - calcTotal(freelancer, 95);
                  return (
                    <>
                      {diff > 0 ? `+${formatYen(diff)}` : diff < 0 ? `-${formatYen(Math.abs(diff))}` : formatYen(0)}
                      <span className="text-[10px] sm:text-xs font-normal ml-1">
                        {diff > 0 ? "（正社員が多い）" : diff < 0 ? "（個人事業主が多い）" : "（同額）"}
                      </span>
                    </>
                  );
                })()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
