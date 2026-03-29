import { ComparisonView } from "@/components/ComparisonView";
import { AboutButton } from "@/components/AboutModal";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            手取り比較シミュレーター
          </h1>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-500">
              正社員 vs 業務委託（フリーランス）
            </p>
            <AboutButton />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <ComparisonView />
      </main>
    </div>
  );
}
