// --- Inputs ---

export interface EmployeeInput {
  annualSalary: number;
  age: number;
  healthInsuranceRate: number; // e.g. 5.0 means 5%
  ideco: number; // monthly amount (0-23000)
  paidLeaveDays: number; // 有給休暇日数
}

export type ConsumptionTaxMethod = "twenty-percent" | "simplified" | "standard";

export interface FreelancerInput {
  annualRevenue: number;
  expenses: number;
  isBlueReturn: boolean;
  nationalHealthInsuranceRate: number; // e.g. 10.0 means 10%
  shoukiboKigyouKyousai: number; // monthly amount (0-70000)
  ideco: number; // monthly amount (0-68000)
  isInvoiceRegistered: boolean;
  consumptionTaxMethod: ConsumptionTaxMethod;
}

// --- Outputs ---

export interface BreakdownItem {
  label: string;
  amount: number;
  isSubtotal?: boolean;
  isHighlight?: boolean;
  isReference?: boolean;
  tooltip?: string;
}

export interface SocialInsuranceEmployee {
  pension: number;
  healthInsurance: number;
  employmentInsurance: number;
  longTermCareInsurance: number;
  total: number;
}

export interface SocialInsuranceFreelancer {
  nationalPension: number;
  nationalHealthInsurance: number;
  total: number;
}

export interface OptionalDeductions {
  shoukiboKigyouKyousai: number;
  ideco: number;
  total: number;
}

export interface EmployeeResult {
  grossIncome: number;
  employmentIncomeDeduction: number;
  employmentIncome: number;
  socialInsurance: SocialInsuranceEmployee;
  basicDeduction: number;
  taxableIncome: number;
  incomeTax: number;
  reconstructionTax: number;
  residentTax: number;
  totalDeductions: number;
  takeHomePay: number;
  effectiveTaxRate: number;
  breakdownItems: BreakdownItem[];
}

export interface FreelancerResult {
  annualRevenue: number;
  expenses: number;
  businessIncome: number;
  blueReturnDeduction: number;
  income: number;
  socialInsurance: SocialInsuranceFreelancer;
  basicDeduction: number;
  optionalDeductions: OptionalDeductions;
  taxableIncome: number;
  incomeTax: number;
  reconstructionTax: number;
  residentTax: number;
  businessTax: number;
  consumptionTax: number;
  totalDeductions: number;
  takeHomePay: number;
  effectiveTaxRate: number;
  breakdownItems: BreakdownItem[];
}
