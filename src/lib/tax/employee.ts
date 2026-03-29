import type { EmployeeInput, EmployeeResult, BreakdownItem } from "../types";
import {
  EMPLOYMENT_INCOME_DEDUCTION_BRACKETS,
  EMPLOYEE_PENSION_RATE,
  EMPLOYEE_PENSION_SALARY_CAP,
  EMPLOYMENT_INSURANCE_RATE,
  LONG_TERM_CARE_INSURANCE_RATE,
  LONG_TERM_CARE_MIN_AGE,
  BASIC_DEDUCTION_INCOME_TAX,
  BASIC_DEDUCTION_RESIDENT_TAX,
} from "./constants";
import { floor0, floorThousand, calcIncomeTax, calcReconstructionTax, calcResidentTax } from "./common";

/** 給与所得控除を計算 */
export function calcEmploymentIncomeDeduction(annualSalary: number): number {
  if (annualSalary <= 0) return 0;
  const bracket = EMPLOYMENT_INCOME_DEDUCTION_BRACKETS.find(
    (b) => annualSalary <= b.max
  );
  if (!bracket) return 0;
  return Math.floor(bracket.calc(annualSalary));
}

/** 正社員の手取り計算 */
export function calculateEmployee(input: EmployeeInput): EmployeeResult {
  const { annualSalary, age, healthInsuranceRate } = input;

  // 給与所得控除
  const employmentIncomeDeduction = calcEmploymentIncomeDeduction(annualSalary);
  const employmentIncome = floor0(annualSalary - employmentIncomeDeduction);

  // 社会保険料
  const pensionBase = Math.min(annualSalary, EMPLOYEE_PENSION_SALARY_CAP);
  const pension = Math.floor(pensionBase * EMPLOYEE_PENSION_RATE);
  const healthInsurance = Math.floor(annualSalary * (healthInsuranceRate / 100));
  const employmentInsurance = Math.floor(annualSalary * EMPLOYMENT_INSURANCE_RATE);
  const longTermCareInsurance =
    age >= LONG_TERM_CARE_MIN_AGE
      ? Math.floor(annualSalary * LONG_TERM_CARE_INSURANCE_RATE)
      : 0;
  const socialInsuranceTotal =
    pension + healthInsurance + employmentInsurance + longTermCareInsurance;

  // 課税所得（1,000円未満切り捨て）
  const taxableIncomeForIncomeTax = floorThousand(
    floor0(employmentIncome - socialInsuranceTotal - BASIC_DEDUCTION_INCOME_TAX)
  );
  const taxableIncomeForResidentTax = floorThousand(
    floor0(employmentIncome - socialInsuranceTotal - BASIC_DEDUCTION_RESIDENT_TAX)
  );

  // 税金
  const incomeTax = calcIncomeTax(taxableIncomeForIncomeTax);
  const reconstructionTax = calcReconstructionTax(incomeTax);
  const residentTax = calcResidentTax(taxableIncomeForResidentTax);

  // 手取り
  const totalDeductions =
    socialInsuranceTotal + incomeTax + reconstructionTax + residentTax;
  const takeHomePay = annualSalary - totalDeductions;
  const effectiveTaxRate =
    annualSalary > 0 ? (totalDeductions / annualSalary) * 100 : 0;

  // 内訳表示
  const breakdownItems: BreakdownItem[] = [
    { label: "年収（額面）", amount: annualSalary, isSubtotal: true },
    { label: "給与所得控除", amount: -employmentIncomeDeduction, tooltip: "正社員版の「経費」にあたる控除です。フリーランスのように実費を計上できない代わりに、年収に応じて国が一律で認める控除額が自動的に差し引かれます。" },
    { label: "給与所得", amount: employmentIncome, isSubtotal: true },
    { label: "厚生年金保険料", amount: -pension },
    { label: "健康保険料", amount: -healthInsurance },
    { label: "雇用保険料", amount: -employmentInsurance },
    ...(longTermCareInsurance > 0
      ? [{ label: "介護保険料", amount: -longTermCareInsurance }]
      : []),
    { label: "社会保険料 合計", amount: -socialInsuranceTotal, isSubtotal: true },
    { label: "基礎控除", amount: -BASIC_DEDUCTION_INCOME_TAX },
    { label: "課税所得", amount: taxableIncomeForIncomeTax, isSubtotal: true },
    { label: "所得税", amount: -incomeTax },
    { label: "復興特別所得税", amount: -reconstructionTax },
    { label: "住民税", amount: -residentTax },
    {
      label: "手取り額",
      amount: takeHomePay,
      isSubtotal: true,
      isHighlight: true,
    },
  ];

  return {
    grossIncome: annualSalary,
    employmentIncomeDeduction,
    employmentIncome,
    socialInsurance: {
      pension,
      healthInsurance,
      employmentInsurance,
      longTermCareInsurance,
      total: socialInsuranceTotal,
    },
    basicDeduction: BASIC_DEDUCTION_INCOME_TAX,
    taxableIncome: taxableIncomeForIncomeTax,
    incomeTax,
    reconstructionTax,
    residentTax,
    totalDeductions,
    takeHomePay,
    effectiveTaxRate,
    breakdownItems,
  };
}
