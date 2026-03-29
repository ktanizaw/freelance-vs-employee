"use client";

import { useState, useMemo } from "react";
import { useEmployeeCalc } from "@/hooks/useEmployeeCalc";
import { useFreelancerCalc } from "@/hooks/useFreelancerCalc";
import { calculateFreelancer } from "@/lib/tax/freelancer";
import { EmployeePanel } from "./EmployeePanel";
import { FreelancerPanel } from "./FreelancerPanel";
import { MiniComparisonBar } from "./MiniComparisonBar";
import { PensionSimulation } from "./PensionSimulation";
import { IdecoSimulation } from "./IdecoSimulation";
import { RetirementSimulation } from "./RetirementSimulation";
import { QualitativeComparison } from "./QualitativeComparison";
import {
  BASIC_PENSION_ANNUAL,
  EMPLOYEE_PENSION_MULTIPLIER,
  NATIONAL_PENSION_MONTHLY,
} from "@/lib/tax/constants";

type Tab = "employee" | "freelancer";

const PENSION_START_AGE = 65;
const DEFAULT_IDECO_RETURN_RATE = 3.0;

/** iDeCoの積立額を複利計算（毎月積立） */
function calcIdecoFutureValue(monthlyAmount: number, years: number, annualRate: number): number {
  if (monthlyAmount <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return monthlyAmount * years * 12;
  const months = years * 12;
  return Math.floor(monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
}

export function ComparisonView() {
  const [activeTab, setActiveTab] = useState<Tab>("employee");
  const [idecoReturnRate, setIdecoReturnRate] = useState(DEFAULT_IDECO_RETURN_RATE);
  const employee = useEmployeeCalc();
  const freelancer = useFreelancerCalc();

  const remainingYears = Math.max(0, PENSION_START_AGE - employee.input.age);

  const pensionData = useMemo(() => {
    const contributionYears = Math.min(remainingYears, 40);

    const employeePensionAnnual = employee.result.socialInsurance.pension;
    const freelancerPensionAnnual = NATIONAL_PENSION_MONTHLY * 12;

    const basicPension = Math.floor(BASIC_PENSION_ANNUAL * contributionYears / 40);
    const salaryRelated = Math.floor(
      employee.input.annualSalary / 12 * EMPLOYEE_PENSION_MULTIPLIER * contributionYears * 12
    );

    return {
      age: employee.input.age,
      remainingYears,
      employee: {
        annualPayment: employeePensionAnnual,
        totalPaid: employeePensionAnnual * remainingYears,
        annualBenefit: basicPension + salaryRelated,
      },
      freelancer: {
        annualPayment: freelancerPensionAnnual,
        totalPaid: freelancerPensionAnnual * remainingYears,
        annualBenefit: basicPension,
      },
    };
  }, [employee.input.age, employee.input.annualSalary, employee.result.socialInsurance.pension, remainingYears]);

  const idecoData = useMemo(() => {
    const empIdecoAnnual = employee.input.ideco * 12;
    const flIdecoAnnual = freelancer.input.ideco * 12;

    return {
      remainingYears,
      employee: {
        idecoAnnual: empIdecoAnnual,
        idecoTotal: empIdecoAnnual * remainingYears,
        idecoFutureValue: calcIdecoFutureValue(employee.input.ideco, remainingYears, idecoReturnRate),
      },
      freelancer: {
        idecoAnnual: flIdecoAnnual,
        idecoTotal: flIdecoAnnual * remainingYears,
        idecoFutureValue: calcIdecoFutureValue(freelancer.input.ideco, remainingYears, idecoReturnRate),
      },
    };
  }, [employee.input.ideco, freelancer.input.ideco, remainingYears, idecoReturnRate]);

  const hasAnyIdeco = employee.input.ideco > 0 || freelancer.input.ideco > 0;
  const [includePaidLeave, setIncludePaidLeave] = useState(false);

  const ANNUAL_WORKING_DAYS = 245;
  const paidLeaveDays = employee.input.paidLeaveDays;

  // 有給減収を反映したフリーランスの計算結果
  const freelancerResultWithPaidLeave = useMemo(() => {
    if (!includePaidLeave || paidLeaveDays <= 0) return freelancer.result;

    // 有給分の売上減少を算出し、減少後の売上で再計算
    const lostRevenue = Math.floor(freelancer.input.annualRevenue / ANNUAL_WORKING_DAYS) * paidLeaveDays;
    const adjustedRevenue = freelancer.input.annualRevenue - lostRevenue;

    return calculateFreelancer({
      ...freelancer.input,
      annualRevenue: adjustedRevenue,
    });
  }, [freelancer.result, freelancer.input, paidLeaveDays, includePaidLeave]);

  return (
    <>
      {/* モバイル: タブ + 比較バー */}
      <div className="md:hidden space-y-4">
        <MiniComparisonBar
          employeeTakeHome={employee.result.takeHomePay}
          freelancerTakeHome={freelancerResultWithPaidLeave.takeHomePay}
        />
        <div className="flex rounded-lg bg-gray-200 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("employee")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
              activeTab === "employee"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500"
            }`}
          >
            正社員
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("freelancer")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
              activeTab === "freelancer"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500"
            }`}
          >
            個人事業主
          </button>
        </div>
        {activeTab === "employee" ? (
          <EmployeePanel
            input={employee.input}
            result={employee.result}
            updateField={employee.updateField}
          />
        ) : (
          <FreelancerPanel
            input={freelancer.input}
            result={freelancerResultWithPaidLeave}
            updateField={freelancer.updateField}
            paidLeaveToggle={{
              enabled: includePaidLeave,
              onChange: setIncludePaidLeave,
              days: paidLeaveDays,
            }}
          />
        )}
      </div>

      {/* デスクトップ: 2カラム */}
      <div className="hidden md:grid md:grid-cols-2 gap-12">
        <EmployeePanel
          input={employee.input}
          result={employee.result}
          updateField={employee.updateField}
        />
        <FreelancerPanel
          input={freelancer.input}
          result={freelancerResultWithPaidLeave}
          updateField={freelancer.updateField}
          paidLeaveToggle={{
            enabled: includePaidLeave,
            onChange: setIncludePaidLeave,
            days: paidLeaveDays,
          }}
        />
      </div>

      {/* 年金シミュレーション */}
      <PensionSimulation data={pensionData} />

      {/* iDeCo 資産運用シミュレーション */}
      {hasAnyIdeco && (
        <IdecoSimulation
          data={idecoData}
          idecoReturnRate={idecoReturnRate}
          onIdecoReturnRateChange={setIdecoReturnRate}
        />
      )}
      {/* 退職金シミュレーション */}
      <RetirementSimulation
        remainingYears={remainingYears}
        age={employee.input.age}
        shoukiboMonthly={freelancer.input.shoukiboKigyouKyousai}
        annualSalary={employee.input.annualSalary}
      />

      {/* その他の定性比較 */}
      <QualitativeComparison />
    </>
  );
}
