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
  },
  {
    category: "傷病手当金",
    employee: "給与の2/3を最大1年半支給",
    freelancer: "なし",
  },
  {
    category: "失業保険",
    employee: "給与の50〜80%を最大330日",
    freelancer: "なし",
  },
  {
    category: "育休・産休手当",
    employee: "産休: 給与の2/3、育休: 給与の50〜67%",
    freelancer: "国民年金の免除のみ",
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
  },
  {
    category: "労災保険",
    employee: "自動加入（全額会社負担）",
    freelancer: "特別加入（任意・自己負担）",
  },
];

export function QualitativeComparison() {
  return (
    <div className="mt-4 bg-white border border-slate-200 border-l-4 border-l-slate-400 shadow-sm rounded-xl p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-4 flex items-center">
        その他の比較
        <Tooltip text="金額に換算しにくい待遇面・制度面の違いです。" />
      </h3>

      <div>
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-300">
              <th className="text-left py-2 pr-2 sm:pr-4 text-slate-600 font-semibold" />
              <th className="text-left py-2 px-1 sm:px-4 text-blue-600 font-semibold">正社員</th>
              <th className="text-left py-2 pl-1 sm:pl-4 text-emerald-600 font-semibold">個人事業主</th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            {COMPARISON_DATA.map((row) => (
              <tr key={row.category} className="border-b border-slate-100">
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
