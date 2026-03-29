"use client";

import { useState, useMemo } from "react";
import type { FreelancerInput, FreelancerResult } from "@/lib/types";
import { calculateFreelancer } from "@/lib/tax/freelancer";
import { DEFAULT_NHI_RATE } from "@/lib/tax/constants";

const DEFAULT_INPUT: FreelancerInput = {
  annualRevenue: 6_000_000,
  expenses: 0,
  isBlueReturn: true,
  nationalHealthInsuranceRate: DEFAULT_NHI_RATE,
  shoukiboKigyouKyousai: 0,
  ideco: 0,
  isInvoiceRegistered: true,
  consumptionTaxMethod: "twenty-percent",
};

export function useFreelancerCalc() {
  const [input, setInput] = useState<FreelancerInput>(DEFAULT_INPUT);

  const result: FreelancerResult = useMemo(
    () => calculateFreelancer(input),
    [input]
  );

  const updateField = <K extends keyof FreelancerInput>(
    field: K,
    value: FreelancerInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  return { input, result, updateField };
}
