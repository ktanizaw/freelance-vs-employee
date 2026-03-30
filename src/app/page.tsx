import { ComparisonView } from "@/components/ComparisonView";
import { AboutButton } from "@/components/AboutModal";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              <span className="block sm:inline">正社員 vs 個人事業主</span>{" "}
              <span className="block sm:inline">Money Simulator</span>
            </h1>
            <AboutButton />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <ComparisonView />
      </main>
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © 2026 Money Simulator | 計算結果は概算です。正確な税額は専門家にご確認ください。
      </footer>
    </div>
  );
}
