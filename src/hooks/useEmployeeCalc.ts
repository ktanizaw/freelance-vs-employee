"use client";

import { useState, useMemo } from "react";
import type { EmployeeInput, EmployeeResult } from "@/lib/types";
import { calculateEmployee } from "@/lib/tax/employee";
import { DEFAULT_HEALTH_INSURANCE_RATE } from "@/lib/tax/constants";

const DEFAULT_INPUT: EmployeeInput = {
  annualSalary: 6_000_000,
  age: 30,
  healthInsuranceRate: DEFAULT_HEALTH_INSURANCE_RATE,
};

export function useEmployeeCalc() {
  const [input, setInput] = useState<EmployeeInput>(DEFAULT_INPUT);

  const result: EmployeeResult = useMemo(
    () => calculateEmployee(input),
    [input]
  );

  const updateField = <K extends keyof EmployeeInput>(
    field: K,
    value: EmployeeInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  return { input, result, updateField };
}
