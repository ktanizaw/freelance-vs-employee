"use client";

import type { EmployeeInput, EmployeeResult } from "@/lib/types";
import { CurrencyInput } from "./CurrencyInput";
import { NumberInput } from "./NumberInput";

import { BreakdownTable } from "./BreakdownTable";
import { SummaryBar } from "./SummaryBar";

interface EmployeePanelProps {
  input: EmployeeInput;
  result: EmployeeResult;
  updateField: <K extends keyof EmployeeInput>(field: K, value: EmployeeInput[K]) => void;
}

export function EmployeePanel({ input, result, updateField }: EmployeePanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-900 border-b-2 border-green-500 pb-2 hidden md:block">
        正社員
      </h2>

      <div className="flex flex-col gap-4">
        <CurrencyInput
          label="年収（額面）"
          value={input.annualSalary}
          onChange={(v) => updateField("annualSalary", v)}
          step={100000}
        />
        <NumberInput
          label="年齢"
          value={input.age}
          onChange={(v) => updateField("age", v)}
          unit="歳"
          min={18}
          max={70}
          tooltip="40歳以上になると介護保険料（約0.82%）の負担が追加されます。39歳以下では介護保険料はかかりません。"
        />
        <NumberInput
          label="健康保険料率"
          value={input.healthInsuranceRate}
          onChange={(v) => updateField("healthInsuranceRate", v)}
          unit="%"
          min={0}
          max={15}
          step={0.1}
          tooltip="勤務先の健康保険の自己負担料率です。協会けんぽの場合、都道府県により約4.75%〜5.25%（全体の約10%を会社と折半）。給与明細には金額のみ記載されることが多く、料率は保険証の保険者に確認できます。わからない場合はデフォルトの5%のままで概算できます。"
        />
        <CurrencyInput
          label="iDeCo（月額）"
          value={input.ideco}
          onChange={(v) => updateField("ideco", v)}
          step={1000}
          max={23000}
          tooltip="正社員のiDeCo上限額は企業年金の有無により異なります。企業年金なし: 月23,000円、企業型DCのみ: 月20,000円、DB併用: 月12,000円。掛金は全額が所得控除の対象になります。加入は任意です。"
        />
        <NumberInput
          label="有給休暇"
          value={input.paidLeaveDays}
          onChange={(v) => updateField("paidLeaveDays", v)}
          unit="日"
          min={0}
          max={40}
          tooltip="年間の有給休暇日数です。勤続年数に応じて10〜20日が付与されます（法定）。個人事業主が同じ日数休んだ場合の減収額と比較できます。"
        />
      </div>

      <SummaryBar
        takeHomePay={result.takeHomePay}
        effectiveTaxRate={result.effectiveTaxRate}
        colorClass="bg-green-600"
      />

      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2">内訳</h3>
        <BreakdownTable items={result.breakdownItems} />
      </div>
    </div>
  );
}
