import type { FreelancerInput, FreelancerResult, BreakdownItem, ConsumptionTaxMethod } from "../types";
import {
  NATIONAL_PENSION_MONTHLY,
  BASIC_DEDUCTION_INCOME_TAX,
  BASIC_DEDUCTION_RESIDENT_TAX,
  BLUE_RETURN_DEDUCTION,
  BUSINESS_TAX_RATE,
  BUSINESS_TAX_EXEMPTION,
  CONSUMPTION_TAX_RATE,
  TWENTY_PERCENT_SPECIAL_RATE,
  SIMPLIFIED_DEEMED_PURCHASE_RATE,
} from "./constants";
import { floor0, floorThousand, calcIncomeTax, calcReconstructionTax, calcResidentTax } from "./common";

/** 国民健康保険を計算（簡易版：所得ベース） */
export function calcNationalHealthInsurance(
  income: number,
  rate: number
): number {
  if (income <= 0) return 0;
  // 国保は前年所得に基づく。簡易的に所得 × 料率で計算
  // 上限は約106万円（医療+支援+介護の合計上限）
  const calculated = Math.floor(income * (rate / 100));
  return Math.min(calculated, 1_060_000);
}

/** 個人事業税を計算 */
export function calcBusinessTax(businessIncome: number): number {
  // 事業所得から事業主控除290万を引いた額に5%
  // 注意: 青色申告特別控除は事業税の計算には適用されない
  return Math.floor(floor0(businessIncome - BUSINESS_TAX_EXEMPTION) * BUSINESS_TAX_RATE);
}

/** 消費税納付額を計算 */
export function calcConsumptionTax(
  annualRevenue: number,
  expenses: number,
  method: ConsumptionTaxMethod
): number {
  const salesTax = Math.floor(annualRevenue * CONSUMPTION_TAX_RATE);
  switch (method) {
    case "twenty-percent":
      return Math.floor(salesTax * TWENTY_PERCENT_SPECIAL_RATE);
    case "simplified":
      return Math.floor(salesTax * (1 - SIMPLIFIED_DEEMED_PURCHASE_RATE));
    case "standard":
      return Math.floor(salesTax - Math.floor(expenses * CONSUMPTION_TAX_RATE));
  }
}

/** 業務委託の手取り計算 */
export function calculateFreelancer(input: FreelancerInput): FreelancerResult {
  const {
    annualRevenue,
    expenses,
    isBlueReturn,
    nationalHealthInsuranceRate,
    shoukiboKigyouKyousai,
    ideco,
    isInvoiceRegistered,
    consumptionTaxMethod,
  } = input;

  // 事業所得
  const businessIncome = floor0(annualRevenue - expenses);

  // 青色申告特別控除
  const blueReturnDeduction = isBlueReturn
    ? Math.min(BLUE_RETURN_DEDUCTION, businessIncome)
    : 0;
  const income = floor0(businessIncome - blueReturnDeduction);

  // 社会保険料
  const nationalPension = NATIONAL_PENSION_MONTHLY * 12;
  const nationalHealthInsurance = calcNationalHealthInsurance(
    income,
    nationalHealthInsuranceRate
  );
  const socialInsuranceTotal = nationalPension + nationalHealthInsurance;

  // 任意控除
  const shoukiboAnnual = shoukiboKigyouKyousai * 12;
  const idecoAnnual = ideco * 12;
  const optionalDeductionsTotal = shoukiboAnnual + idecoAnnual;

  // 課税所得（1,000円未満切り捨て）
  const taxableIncomeForIncomeTax = floorThousand(
    floor0(income - socialInsuranceTotal - BASIC_DEDUCTION_INCOME_TAX - optionalDeductionsTotal)
  );
  const taxableIncomeForResidentTax = floorThousand(
    floor0(income - socialInsuranceTotal - BASIC_DEDUCTION_RESIDENT_TAX - optionalDeductionsTotal)
  );

  // 税金
  const incomeTax = calcIncomeTax(taxableIncomeForIncomeTax);
  const reconstructionTax = calcReconstructionTax(incomeTax);
  const residentTax = calcResidentTax(taxableIncomeForResidentTax);

  // 個人事業税（青色控除は適用しない）
  const businessTax = calcBusinessTax(businessIncome);

  // 消費税
  const consumptionTax = isInvoiceRegistered
    ? calcConsumptionTax(annualRevenue, expenses, consumptionTaxMethod)
    : 0;

  // 手取り
  const totalDeductions =
    socialInsuranceTotal +
    optionalDeductionsTotal +
    incomeTax +
    reconstructionTax +
    residentTax +
    businessTax +
    consumptionTax;
  const takeHomePay = annualRevenue - expenses - totalDeductions;
  const effectiveTaxRate =
    annualRevenue > 0 ? (totalDeductions / annualRevenue) * 100 : 0;

  // 内訳表示
  const breakdownItems: BreakdownItem[] = [
    { label: "年間売上", amount: annualRevenue, isSubtotal: true },
    { label: "経費", amount: -expenses },
    { label: "事業所得", amount: businessIncome, isSubtotal: true },
    ...(blueReturnDeduction > 0
      ? [{ label: "青色申告特別控除", amount: -blueReturnDeduction }]
      : []),
    { label: "所得", amount: income, isSubtotal: true },
    { label: "国民年金", amount: -nationalPension },
    { label: "国民健康保険", amount: -nationalHealthInsurance },
    { label: "社会保険料 合計", amount: -socialInsuranceTotal, isSubtotal: true },
    ...(shoukiboAnnual > 0
      ? [{ label: "小規模企業共済", amount: -shoukiboAnnual }]
      : []),
    ...(idecoAnnual > 0 ? [{ label: "iDeCo", amount: -idecoAnnual }] : []),
    { label: "基礎控除", amount: -BASIC_DEDUCTION_INCOME_TAX },
    { label: "課税所得", amount: taxableIncomeForIncomeTax, isSubtotal: true },
    { label: "所得税", amount: -incomeTax },
    { label: "復興特別所得税", amount: -reconstructionTax },
    { label: "住民税", amount: -residentTax },
    { label: "個人事業税", amount: -businessTax },
    ...(consumptionTax > 0
      ? [{ label: "消費税納付額", amount: -consumptionTax }]
      : []),
    {
      label: "手取り額",
      amount: takeHomePay,
      isSubtotal: true,
      isHighlight: true,
    },
  ];

  return {
    annualRevenue,
    expenses,
    businessIncome,
    blueReturnDeduction,
    income,
    socialInsurance: {
      nationalPension,
      nationalHealthInsurance,
      total: socialInsuranceTotal,
    },
    basicDeduction: BASIC_DEDUCTION_INCOME_TAX,
    optionalDeductions: {
      shoukiboKigyouKyousai: shoukiboAnnual,
      ideco: idecoAnnual,
      total: optionalDeductionsTotal,
    },
    taxableIncome: taxableIncomeForIncomeTax,
    incomeTax,
    reconstructionTax,
    residentTax,
    businessTax,
    consumptionTax,
    totalDeductions,
    takeHomePay,
    effectiveTaxRate,
    breakdownItems,
  };
}
