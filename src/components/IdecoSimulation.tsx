"use client";

import { formatYen } from "@/lib/format";
import { Tooltip } from "./Tooltip";
import { NumberInput } from "./NumberInput";

interface IdecoSide {
  idecoAnnual: number;
  idecoTotal: number;
  idecoFutureValue: number;
}

interface IdecoData {
  remainingYears: number;
  employee: IdecoSide;
  freelancer: IdecoSide;
}

interface IdecoSimulationProps {
  data: IdecoData;
  idecoReturnRate: number;
  onIdecoReturnRateChange: (rate: number) => void;
}

export function IdecoSimulation({ data, idecoReturnRate, onIdecoReturnRateChange }: IdecoSimulationProps) {
  const { remainingYears, employee, freelancer } = data;

  function formatCell(value: number) {
    if (value > 0) return formatYen(value);
    return <span className="text-gray-400">-</span>;
  }

  return (
    <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-bold text-indigo-900 mb-1 flex items-center">
        iDeCo 資産運用シミュレーション（参考）
        <Tooltip text="iDeCoは年金と異なり終身受給ではありません。運用した資産を一括または分割で受け取る仕組みです。受取時に退職所得控除や公的年金等控除の税制優遇があります。" />
      </h3>
      <p className="text-xs text-indigo-700 mb-4">
        65歳まで残り{remainingYears}年積み立てた場合
      </p>

      <div className="mb-4">
        <NumberInput
          label="想定利回り"
          value={idecoReturnRate}
          onChange={onIdecoReturnRateChange}
          unit="%"
          min={0}
          max={10}
          step={0.5}
          tooltip="iDeCoの運用利回りの想定値です。定期預金なら約0%、バランス型で2〜4%、株式中心なら4〜7%程度が目安です。運用結果を保証するものではありません。"
        />
      </div>

      <div>
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-indigo-300">
              <th className="text-left py-2 pr-2 sm:pr-4 text-indigo-800 font-semibold" />
              <th className="text-right py-2 px-1 sm:px-4 text-green-700 font-semibold">正社員</th>
              <th className="text-right py-2 pl-1 sm:pl-4 text-blue-700 font-semibold">個人事業主</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-indigo-100">
              <td className="py-2 pr-2 sm:pr-4">年間積立額</td>
              <td className="text-right py-2 px-1 sm:px-4 font-mono">{formatCell(employee.idecoAnnual)}</td>
              <td className="text-right py-2 pl-1 sm:pl-4 font-mono">{formatCell(freelancer.idecoAnnual)}</td>
            </tr>
            <tr className="border-b border-indigo-100">
              <td className="py-2 pr-2 sm:pr-4">積立元本（{remainingYears}年）</td>
              <td className="text-right py-2 px-1 sm:px-4 font-mono">{formatCell(employee.idecoTotal)}</td>
              <td className="text-right py-2 pl-1 sm:pl-4 font-mono">{formatCell(freelancer.idecoTotal)}</td>
            </tr>
            <tr>
              <td className="py-2 pr-2 sm:pr-4 flex items-center">
                65歳時点の資産
                <Tooltip text={`毎月の積立額を年利${idecoReturnRate}%で${remainingYears}年間複利運用した場合の概算です。運用結果を保証するものではありません。`} />
              </td>
              <td className="text-right py-2 px-1 sm:px-4 font-mono font-semibold text-green-700">
                {formatCell(employee.idecoFutureValue)}
              </td>
              <td className="text-right py-2 pl-1 sm:pl-4 font-mono font-semibold text-blue-700">
                {formatCell(freelancer.idecoFutureValue)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
