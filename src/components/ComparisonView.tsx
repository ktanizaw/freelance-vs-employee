"use client";

import { useState } from "react";
import { useEmployeeCalc } from "@/hooks/useEmployeeCalc";
import { useFreelancerCalc } from "@/hooks/useFreelancerCalc";
import { EmployeePanel } from "./EmployeePanel";
import { FreelancerPanel } from "./FreelancerPanel";
import { MiniComparisonBar } from "./MiniComparisonBar";

type Tab = "employee" | "freelancer";

export function ComparisonView() {
  const [activeTab, setActiveTab] = useState<Tab>("employee");
  const employee = useEmployeeCalc();
  const freelancer = useFreelancerCalc();

  return (
    <>
      {/* モバイル: タブ + 比較バー */}
      <div className="md:hidden space-y-4">
        <MiniComparisonBar
          employeeTakeHome={employee.result.takeHomePay}
          freelancerTakeHome={freelancer.result.takeHomePay}
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
            業務委託
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
            result={freelancer.result}
            updateField={freelancer.updateField}
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
          result={freelancer.result}
          updateField={freelancer.updateField}
        />
      </div>
    </>
  );
}
