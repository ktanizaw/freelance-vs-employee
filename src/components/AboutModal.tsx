"use client";

import { useState } from "react";

export function AboutButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-slate-300 border border-slate-600 rounded-lg px-3 py-1.5 hover:bg-slate-700 transition-colors"
      >
        補足
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                補足
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                aria-label="閉じる"
              >
                &times;
              </button>
            </div>
            <div className="p-5 text-sm text-gray-700 leading-relaxed space-y-4">
              <section>
                <h3 className="font-semibold text-gray-900 mb-1">
                  計算に含まれないもの
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                  <li>
                    <span className="font-medium">配偶者控除・扶養控除</span>
                    ：正社員・個人事業主両方に同じ額が適用されるため、比較結果への影響は軽微です
                  </li>
                  <li>
                    <span className="font-medium">65歳以上の制度変更</span>
                    ：後期高齢者医療制度、厚生年金資格喪失など。現役世代を想定しているため対象外です
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-1">注意事項</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                  <li>
                    計算結果はあくまで概算です。実際の税額は個人の状況により異なります
                  </li>
                  <li>
                    社会保険料率は標準的な値を使用しています。勤務先や自治体により異なる場合があります
                  </li>
                  <li>
                    税制は変更される場合があります。最新の情報は税務署や専門家にご確認ください
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
