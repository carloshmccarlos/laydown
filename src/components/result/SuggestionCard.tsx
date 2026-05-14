import { AdjustmentSuggestion } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

const difficultyLabel = { easy: "容易", medium: "中等", hard: "困难" };
const difficultyColor = {
  easy: "text-green-600 bg-green-50 border-green-200",
  medium: "text-amber-600 bg-amber-50 border-amber-200",
  hard: "text-red-600 bg-red-50 border-red-200",
};

type SuggestionCardProps = {
  suggestion: AdjustmentSuggestion;
  config: { icon: LucideIcon; color: string; bg: string; tag?: string; tagColor?: string };
};

function getBottomLine(suggestion: AdjustmentSuggestion): { label: string; value: string; valueColor: string } | null {
  if (suggestion.monthlyExpenseReduction !== undefined) {
    return { label: "目标：", value: `每月减少 ¥${suggestion.monthlyExpenseReduction.toLocaleString()}`, valueColor: "text-green-600" };
  }
  if (suggestion.passiveIncomeIncrease !== undefined) {
    return { label: "目标：", value: "提升每月被动收入", valueColor: "text-violet-600" };
  }
  if (suggestion.recommendedLivingLevel) {
    return { label: "策略：", value: "降低一个生活等级", valueColor: "text-amber-600" };
  }
  if (suggestion.type === "combined_plan") {
    return { label: "策略：", value: "多维度协同优化", valueColor: "text-primary-600" };
  }
  if (suggestion.monthlyIncomeIncrease !== undefined) {
    return { label: "目标：", value: `每月增加 ¥${suggestion.monthlyIncomeIncrease.toLocaleString()}`, valueColor: "text-blue-600" };
  }
  if (suggestion.additionalSavingsRequired !== undefined) {
    return { label: "目标：", value: `一次性补充 ¥${suggestion.additionalSavingsRequired.toLocaleString()}`, valueColor: "text-orange-600" };
  }
  return null;
}

export default function SuggestionCard({ suggestion, config }: SuggestionCardProps) {
  const Icon = config.icon;
  const bottom = getBottomLine(suggestion);

  return (
    <div className={cn("flex h-full flex-col rounded-lg border p-4", config.bg)}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white", config.color)}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-950">{suggestion.title}</span>
        </div>
        <span className={cn("inline-flex shrink-0 items-center rounded border px-2 py-0.5 text-[10px] font-medium", config.tagColor || difficultyColor[suggestion.difficulty])}>
          {config.tag || `难度：${difficultyLabel[suggestion.difficulty]}`}
        </span>
      </div>
      <p className="flex-1 text-sm leading-6 text-slate-600">{suggestion.description}</p>
      {bottom && (
        <div className="mt-2 border-t border-white/70 pt-2 text-sm">
          <span className="text-slate-500">{bottom.label}</span>
          <span className={cn("font-bold", bottom.valueColor)}>{bottom.value}</span>
        </div>
      )}
    </div>
  );
}
