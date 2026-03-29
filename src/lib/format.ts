/** 数値を「¥1,234,567」形式にフォーマット */
export function formatYen(amount: number): string {
  const floored = Math.floor(amount);
  const value = Object.is(floored, -0) ? 0 : floored;
  return `¥${value.toLocaleString("ja-JP")}`;
}

/** 数値を「12.3%」形式にフォーマット */
export function formatPercent(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

/** 円入力文字列を数値に変換 */
export function parseYenInput(value: string): number {
  const num = parseInt(value.replace(/[¥,、，\s]/g, ""), 10);
  return isNaN(num) ? 0 : num;
}
