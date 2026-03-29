"use client";

import { Tooltip } from "./Tooltip";

interface ComparisonRow {
  category: string;
  employee: string;
  freelancer: string;
  tooltip?: string;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    category: "企業型DC",
    employee: "会社が掛金を拠出（月数千〜5.5万円）",
    freelancer: "なし（iDeCoで代替）",
    tooltip: "企業型確定拠出年金。会社が毎月掛金を出し、社員が運用商品を選ぶ仕組みです。iDeCoの会社版にあたり、退職後に受け取れます。制度がない会社もあります。",
  },
  {
    category: "住宅手当",
    employee: "月1〜5万円程度（会社による）",
    freelancer: "なし",
    tooltip: "会社が家賃の一部を補助する制度です。支給額や条件は会社によって異なり、制度自体がない会社もあります。",
  },
  {
    category: "傷病手当金",
    employee: "給与の2/3を最大1年半支給",
    freelancer: "なし",
    tooltip: "業務外の病気やケガで働けなくなった場合の保障です。健康保険から支給されます。",
  },
  {
    category: "失業保険",
    employee: "給与の50〜80%を最大330日",
    freelancer: "なし",
    tooltip: "雇用保険に基づく給付です。自己都合退職の場合は給付開始まで2〜3ヶ月の待機期間があります。",
  },
  {
    category: "育休・産休手当",
    employee: "産休: 給与の2/3、育休: 給与の50〜67%",
    freelancer: "国民年金の免除のみ",
    tooltip: "正社員は健康保険・雇用保険から給付があります。個人事業主は出産手当金・育児休業給付金の対象外です。",
  },
  {
    category: "持株会",
    employee: "奨励金5〜15%上乗せで自社株購入可",
    freelancer: "なし",
    tooltip: "給与天引きで自社株を購入できる制度です。会社が購入額の5〜15%を奨励金として上乗せしてくれるため、実質的な資産形成の補助になります。上場企業に多い制度です。",
  },
  {
    category: "税務・事務処理",
    employee: "会社が年末調整で対応",
    freelancer: "確定申告・帳簿管理を自分で行う",
    tooltip: "個人事業主は毎年の確定申告、日々の帳簿記帳、請求書発行、消費税申告などを自分で行う必要があります。税理士に依頼する場合は年間10〜30万円程度の費用がかかります。",
  },
  {
    category: "労災保険",
    employee: "自動加入（全額会社負担）",
    freelancer: "特別加入（任意・自己負担）",
    tooltip: "業務中や通勤中の事故・病気に対する保障です。正社員は自動で適用されますが、個人事業主は特別加入の手続きが必要です。",
  },
];

export function QualitativeComparison() {
  return (
    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-4 flex items-center">
        その他の比較
        <Tooltip text="金額に換算しにくい待遇面・制度面の違いです。" />
      </h3>

      <div>
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2 pr-2 sm:pr-4 text-gray-700 font-semibold" />
              <th className="text-left py-2 px-1 sm:px-4 text-green-700 font-semibold">正社員</th>
              <th className="text-left py-2 pl-1 sm:pl-4 text-blue-700 font-semibold">個人事業主</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {COMPARISON_DATA.map((row) => (
              <tr key={row.category} className="border-b border-gray-100">
                <td className="py-2.5 pr-2 sm:pr-4 font-medium flex items-center">
                  {row.category}
                  {row.tooltip && <Tooltip text={row.tooltip} />}
                </td>
                <td className="py-2.5 px-1 sm:px-4">{row.employee}</td>
                <td className="py-2.5 pl-1 sm:pl-4">{row.freelancer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
