"use client";

import { useState, useMemo, useEffect } from "react";
import { formatYen } from "@/lib/format";
import { Tooltip } from "./Tooltip";
import { CurrencyInput } from "./CurrencyInput";
import { NumberInput } from "./NumberInput";
import { ToggleSwitch } from "./ToggleSwitch";

/**
 * 小規模企業共済の受取額を概算
 * 20年未満: 掛金総額の約80〜100%
 * 20年以上: 掛金総額の約100〜110%
 * 簡易的に加入年数で線形補間
 */
function calcShoukiboKyousaiBenefit(monthlyAmount: number, years: number): number {
  if (monthlyAmount <= 0 || years <= 0) return 0;
  const totalPaid = monthlyAmount * 12 * years;
  let rate: number;
  if (years < 3) {
    rate = 0.8;
  } else if (years < 20) {
    rate = 0.8 + (years - 3) * (0.2 / 17);
  } else {
    rate = 1.0 + Math.min(years - 20, 20) * (0.1 / 20);
  }
  return Math.floor(totalPaid * rate);
}

/**
 * 退職金の簡易推計
 * 基本給 × 勤続年数 × 支給率
 */
function calcEstimatedRetirement(baseSalary: number, years: number, multiplier: number): number {
  if (baseSalary <= 0 || years <= 0) return 0;
  return Math.floor(baseSalary * years * multiplier);
}

interface RetirementSimulationProps {
  remainingYears: number;
  age: number;
  shoukiboMonthly: number;
  annualSalary: number;
  onRetirementChange?: (employee: number, freelancer: number) => void;
}

export function RetirementSimulation({
  remainingYears,
  age,
  shoukiboMonthly,
  annualSalary,
  onRetirementChange,
}: RetirementSimulationProps) {
  const [useEstimate, setUseEstimate] = useState(true);
  const [directInput, setDirectInput] = useState(0);
  const [baseSalary, setBaseSalary] = useState(Math.floor(annualSalary / 16));
  const [serviceYears, setServiceYears] = useState(remainingYears);
  const [multiplier, setMultiplier] = useState(1.0);

  const employeeRetirement = useMemo(() => {
    if (useEstimate) {
      return calcEstimatedRetirement(baseSalary, serviceYears, multiplier);
    }
    return directInput;
  }, [useEstimate, directInput, baseSalary, serviceYears, multiplier]);

  const shoukiboTotal = shoukiboMonthly * 12 * remainingYears;
  const shoukiboBenefit = useMemo(
    () => calcShoukiboKyousaiBenefit(shoukiboMonthly, remainingYears),
    [shoukiboMonthly, remainingYears]
  );
  const hasShoukibo = shoukiboMonthly > 0;

  useEffect(() => {
    onRetirementChange?.(employeeRetirement, shoukiboBenefit);
  }, [employeeRetirement, shoukiboBenefit, onRetirementChange]);

  return (
    <div className="mt-4 bg-white border border-slate-200 border-l-4 border-l-emerald-500 shadow-sm rounded-xl p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1 flex items-center">
        退職金シミュレーション（参考）
        <Tooltip text="正社員の退職金と個人事業主の小規模企業共済を比較します。退職金の計算方法は会社により大きく異なるため、あくまで目安です。" />
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        現在{age}歳 → 65歳まで残り{remainingYears}年の場合
      </p>

      {/* 正社員の退職金入力 */}
      <div className="mb-4 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h4 className="text-sm font-semibold text-blue-600 mb-3">正社員の退職金</h4>
        <ToggleSwitch
          label="簡易推計を使う"
          checked={useEstimate}
          onChange={setUseEstimate}
          tooltip="ONにすると基本給・勤続年数・支給率から概算します。OFFにすると見込み額を直接入力できます。正確な金額は勤務先の退職金規程を確認してください。"
        />
        <div className="mt-3 flex flex-col gap-3">
          {useEstimate ? (
            <>
              <CurrencyInput
                label="基本給（月額）"
                value={baseSalary}
                onChange={setBaseSalary}
                step={10000}
                tooltip="賞与を除いた月額基本給です。年収から概算する場合、賞与4ヶ月分を想定して年収÷16が目安です。"
              />
              <NumberInput
                label="勤続年数"
                value={serviceYears}
                onChange={setServiceYears}
                unit="年"
                min={0}
                max={50}
              />
              <NumberInput
                label="支給率"
                value={multiplier}
                onChange={setMultiplier}
                unit="倍"
                min={0}
                max={3}
                step={0.1}
                tooltip="基本給×勤続年数に掛ける係数です。中小企業で0.5〜1.0倍、大企業で1.0〜2.0倍程度が目安です。会社の退職金規程によって異なります。"
              />
            </>
          ) : (
            <CurrencyInput
              label="退職金の見込み額"
              value={directInput}
              onChange={setDirectInput}
              step={100000}
            />
          )}
        </div>
      </div>

      {/* 比較テーブル */}
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
              <td className="py-2 pr-2 sm:pr-4">
                {hasShoukibo ? "積立元本" : "制度"}
              </td>
              <td className="text-right py-2 px-1 sm:px-4 font-mono text-gray-500 text-[10px] sm:text-xs">
                {useEstimate
                  ? `${formatYen(baseSalary)} × ${serviceYears}年 × ${multiplier}倍`
                  : "直接入力"
                }
              </td>
              <td className="text-right py-2 pl-1 sm:pl-4 font-mono">
                {hasShoukibo ? (
                  <>
                    {formatYen(shoukiboTotal)}
                    <span className="block text-[10px] sm:text-xs text-gray-500">
                      (月{formatYen(shoukiboMonthly)} × {remainingYears}年)
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">未加入</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-2 sm:pr-4 font-semibold flex items-center">
                受取見込み額
                <Tooltip text="正社員: 退職一時金の見込み額。個人事業主: 小規模企業共済の受取額概算（共済金A：廃業時）。小規模企業共済は加入年数20年以上で掛金総額を上回ります。" />
              </td>
              <td className="text-right py-2 px-1 sm:px-4 font-mono font-semibold text-blue-600">
                {formatYen(employeeRetirement)}
              </td>
              <td className="text-right py-2 pl-1 sm:pl-4 font-mono font-semibold text-emerald-600">
                {hasShoukibo ? formatYen(shoukiboBenefit) : <span className="text-gray-400">-</span>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
