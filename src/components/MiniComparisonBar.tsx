import { formatYen } from "@/lib/format";

interface MiniComparisonBarProps {
  employeeTakeHome: number;
  freelancerTakeHome: number;
}

export function MiniComparisonBar({
  employeeTakeHome,
  freelancerTakeHome,
}: MiniComparisonBarProps) {
  const diff = freelancerTakeHome - employeeTakeHome;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <div className="text-xs text-gray-500">正社員</div>
          <div className="text-base font-bold font-mono text-blue-600">
            {formatYen(employeeTakeHome)}
          </div>
        </div>
        <div className="text-center px-3">
          <div className="text-xs text-gray-400">差額</div>
          <div
            className={`text-sm font-bold font-mono ${
              diff > 0 ? "text-emerald-600" : diff < 0 ? "text-blue-600" : "text-slate-500"
            }`}
          >
            {diff > 0 ? "+" : ""}
            {formatYen(diff)}
          </div>
        </div>
        <div className="text-center flex-1">
          <div className="text-xs text-gray-500">個人事業主</div>
          <div className="text-base font-bold font-mono text-emerald-600">
            {formatYen(freelancerTakeHome)}
          </div>
        </div>
      </div>
    </div>
  );
}
