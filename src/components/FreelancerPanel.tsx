"use client";

import type { FreelancerInput, FreelancerResult, ConsumptionTaxMethod } from "@/lib/types";
import { CurrencyInput } from "./CurrencyInput";
import { NumberInput } from "./NumberInput";
import { ToggleSwitch } from "./ToggleSwitch";
import { SelectInput } from "./SelectInput";
import { BreakdownTable } from "./BreakdownTable";
import { SummaryBar } from "./SummaryBar";

interface FreelancerPanelProps {
  input: FreelancerInput;
  result: FreelancerResult;
  updateField: <K extends keyof FreelancerInput>(field: K, value: FreelancerInput[K]) => void;
  paidLeaveToggle?: {
    enabled: boolean;
    onChange: (v: boolean) => void;
    days: number;
  };
}

export function FreelancerPanel({ input, result, updateField, paidLeaveToggle }: FreelancerPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 hidden md:block">
        個人事業主
      </h2>

      <div className="flex flex-col gap-4">
        <CurrencyInput
          label="年間売上（報酬）"
          value={input.annualRevenue}
          onChange={(v) => updateField("annualRevenue", v)}
          step={100000}
        />
        <CurrencyInput
          label="経費（年間）"
          value={input.expenses}
          onChange={(v) => updateField("expenses", v)}
          step={10000}
        />
        <ToggleSwitch
          label="青色申告（65万円控除）"
          checked={input.isBlueReturn}
          onChange={(v) => updateField("isBlueReturn", v)}
          tooltip="事前に税務署へ届出することで利用できる確定申告の方式です。複式簿記での記帳が必要ですが、最大65万円の特別控除が受けられます。届出していない場合は白色申告（控除なし）になります。個人事業主の大半が青色申告を利用しています。"
        />
        <ToggleSwitch
          label="インボイス登録済み"
          checked={input.isInvoiceRegistered}
          onChange={(v) => updateField("isInvoiceRegistered", v)}
          tooltip="インボイス（適格請求書）を発行するために税務署に登録しているかどうかです。登録すると消費税の納付義務が発生しますが、取引先が仕入税額控除を受けられるため、多くの個人事業主が登録しています。"
        />
        {input.isInvoiceRegistered && (
          <SelectInput
            label="消費税の計算方法"
            value={input.consumptionTaxMethod}
            onChange={(v) => updateField("consumptionTaxMethod", v as ConsumptionTaxMethod)}
            options={[
              { value: "twenty-percent", label: "2割特例（2026年9月まで）" },
              { value: "simplified", label: "簡易課税（みなし仕入率50%）" },
              { value: "standard", label: "本則課税" },
            ]}
            tooltip="2割特例: 消費税の20%だけ納付する軽減措置（2026年9月まで）。簡易課税: 業種ごとのみなし仕入率で計算（IT系は50%）。本則課税: 実際の経費にかかった消費税を差し引いて計算。"
          />
        )}
        <NumberInput
          label="国民健康保険料率"
          value={input.nationalHealthInsuranceRate}
          onChange={(v) => updateField("nationalHealthInsuranceRate", v)}
          unit="%"
          min={0}
          max={20}
          step={0.1}
          tooltip="本ツールでは所得×料率の簡易計算を行っています。実際の国民健康保険料は所得割・均等割・平等割で構成され、市区町村によって大きく異なります（年間数万円〜上限106万円）。正確な金額はお住まいの自治体のサイトで確認してください。"
        />
        <CurrencyInput
          label="小規模企業共済（月額）"
          value={input.shoukiboKigyouKyousai}
          onChange={(v) => updateField("shoukiboKigyouKyousai", v)}
          step={1000}
          max={70000}
          tooltip="個人事業主や小規模企業の経営者向けの退職金制度です。掛金は月1,000〜70,000円で、全額が所得控除の対象になります。将来の退職金・廃業時の資金として受け取れます。加入は任意です。"
        />
        <CurrencyInput
          label="iDeCo（月額）"
          value={input.ideco}
          onChange={(v) => updateField("ideco", v)}
          step={1000}
          max={68000}
          tooltip="個人型確定拠出年金（iDeCo）は、自分で掛金を運用して老後資金を作る私的年金制度です。個人事業主は月最大68,000円まで拠出でき、掛金は全額が所得控除の対象になります。原則60歳まで引き出せません。加入は任意です。"
        />
      </div>

      {paidLeaveToggle && paidLeaveToggle.days > 0 && (
        <ToggleSwitch
          label={`有給${paidLeaveToggle.days}日分の減収を手取りに反映`}
          checked={paidLeaveToggle.enabled}
          onChange={paidLeaveToggle.onChange}
          tooltip="ONにすると、正社員と同じ日数休んだ場合の売上減少分を反映します。年間稼働日数245日を前提に日当を算出し、有給日数分の売上を差し引いた金額で所得税・住民税・事業税・消費税・国保を再計算します。"
        />
      )}

      <SummaryBar
        takeHomePay={result.takeHomePay}
        effectiveTaxRate={result.effectiveTaxRate}
        colorClass="bg-blue-600"
      />

      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2">内訳</h3>
        <BreakdownTable items={result.breakdownItems} />
      </div>
    </div>
  );
}
