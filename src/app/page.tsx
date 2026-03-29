import { ComparisonView } from "@/components/ComparisonView";
import { AboutButton } from "@/components/AboutModal";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
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
    </div>
  );
}
