import { CalculatorResult } from "@/lib/types";
import { ArrowDownCircle, Combine, PiggyBank, TrendingDown, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import { LucideIcon } from "lucide-react";
import SuggestionCard from "./SuggestionCard";

const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string; tag?: string; tagColor?: string }> = {
  increase_income: { icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  reduce_expense: { icon: TrendingDown, color: "text-green-600", bg: "bg-green-50 border-green-100" },
  add_savings: { icon: PiggyBank, color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
  increase_passive_income: { icon: Wallet, color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
  lower_living_level: { icon: ArrowDownCircle, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  combined_plan: { icon: Combine, color: "text-primary-600", bg: "bg-primary-50 border-primary-100", tag: "影响：高", tagColor: "text-blue-600 bg-blue-50 border-blue-200" },
};

interface Props {
  result: CalculatorResult;
}

export default function AdjustmentSuggestions({ result }: Props) {
  if (!result.suggestions.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
      <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-950">
        <BarChart3 className="h-5 w-5 text-primary-600" />
        调整建议
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {result.suggestions.map((suggestion, index) => {
          const config = typeConfig[suggestion.type];
          return <SuggestionCard key={`${suggestion.type}-${index}`} suggestion={suggestion} config={config} />;
        })}
      </div>
    </div>
  );
}
