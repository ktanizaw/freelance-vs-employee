import {
  INCOME_TAX_BRACKETS,
  RECONSTRUCTION_TAX_RATE,
  RESIDENT_TAX_RATE,
  RESIDENT_TAX_PER_CAPITA,
} from "./constants";

/** 0以上に切り捨て */
export function floor0(value: number): number {
  return Math.max(0, value);
}

/** 1,000円未満切り捨て */
export function floorThousand(value: number): number {
  return Math.floor(value / 1000) * 1000;
}

/** 所得税を累進課税テーブルで計算 */
export function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const bracket = INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.max);
  if (!bracket) return 0;
  return Math.floor(taxableIncome * bracket.rate - bracket.deduction);
}

/** 復興特別所得税 */
export function calcReconstructionTax(incomeTax: number): number {
  return Math.floor(incomeTax * RECONSTRUCTION_TAX_RATE);
}

/** 住民税（所得割 + 均等割） */
export function calcResidentTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  return Math.floor(taxableIncome * RESIDENT_TAX_RATE) + RESIDENT_TAX_PER_CAPITA;
}
