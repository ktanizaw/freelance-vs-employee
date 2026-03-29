// 所得税率テーブル（累進課税）
export const INCOME_TAX_BRACKETS = [
  { min: 0, max: 1_950_000, rate: 0.05, deduction: 0 },
  { min: 1_950_000, max: 3_300_000, rate: 0.10, deduction: 97_500 },
  { min: 3_300_000, max: 6_950_000, rate: 0.20, deduction: 427_500 },
  { min: 6_950_000, max: 9_000_000, rate: 0.23, deduction: 636_000 },
  { min: 9_000_000, max: 18_000_000, rate: 0.33, deduction: 1_536_000 },
  { min: 18_000_000, max: 40_000_000, rate: 0.40, deduction: 2_796_000 },
  { min: 40_000_000, max: Infinity, rate: 0.45, deduction: 4_796_000 },
] as const;

// 給与所得控除テーブル
export const EMPLOYMENT_INCOME_DEDUCTION_BRACKETS = [
  { min: 0, max: 1_625_000, calc: () => 550_000 },
  { min: 1_625_000, max: 1_800_000, calc: (s: number) => s * 0.4 - 100_000 },
  { min: 1_800_000, max: 3_600_000, calc: (s: number) => s * 0.3 + 80_000 },
  { min: 3_600_000, max: 6_600_000, calc: (s: number) => s * 0.2 + 440_000 },
  { min: 6_600_000, max: 8_500_000, calc: (s: number) => s * 0.1 + 1_100_000 },
  { min: 8_500_000, max: Infinity, calc: () => 1_950_000 },
] as const;

// 復興特別所得税率
export const RECONSTRUCTION_TAX_RATE = 0.021;

// 住民税
export const RESIDENT_TAX_RATE = 0.10; // 市民税6% + 県民税4%
export const RESIDENT_TAX_PER_CAPITA = 5_000; // 均等割

// 社会保険料率（正社員）
export const EMPLOYEE_PENSION_RATE = 0.0915; // 厚生年金
export const DEFAULT_HEALTH_INSURANCE_RATE = 5.0; // 健康保険 (%)
export const EMPLOYMENT_INSURANCE_RATE = 0.006; // 雇用保険
export const LONG_TERM_CARE_INSURANCE_RATE = 0.0082; // 介護保険
export const LONG_TERM_CARE_MIN_AGE = 40; // 介護保険対象年齢

// 厚生年金の上限（標準報酬月額65万円 × 12ヶ月）
export const EMPLOYEE_PENSION_SALARY_CAP = 7_800_000;

// 国民年金（月額）
export const NATIONAL_PENSION_MONTHLY = 16_980;

// 国民健康保険デフォルト料率 (%)
export const DEFAULT_NHI_RATE = 10.0;

// 基礎控除
export const BASIC_DEDUCTION_INCOME_TAX = 480_000; // 所得税用
export const BASIC_DEDUCTION_RESIDENT_TAX = 430_000; // 住民税用

// 青色申告特別控除
export const BLUE_RETURN_DEDUCTION = 650_000;

// 個人事業税
export const BUSINESS_TAX_RATE = 0.05;
export const BUSINESS_TAX_EXEMPTION = 2_900_000;

// 年金受給額（簡易計算用）
export const BASIC_PENSION_ANNUAL = 831_700; // 基礎年金満額（2025年度）
export const EMPLOYEE_PENSION_MULTIPLIER = 5.481 / 1000; // 報酬比例部分の乗率（2003年4月以降）

// 消費税（インボイス制度）
export const CONSUMPTION_TAX_RATE = 0.10;
export const TWENTY_PERCENT_SPECIAL_RATE = 0.20; // 2割特例
export const SIMPLIFIED_DEEMED_PURCHASE_RATE = 0.50; // 簡易課税みなし仕入率（第5種・サービス業）
