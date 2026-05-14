"use client";

import { CalculatorFormState, CalculatorResult } from "@/lib/types";
import { AlertTriangle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  result: CalculatorResult;
  formState: CalculatorFormState;
}

function getDepletionReasons(result: CalculatorResult, formState: CalculatorFormState): string[] {
  const reasons: string[] = [];
  if (result.monthlySurplus < 0) {
    reasons.push("月支出长期高于收入与收益");
  }
  if (formState.annualInflationRate > 0) {
    reasons.push("存款与收益无法覆盖支出增长");
    reasons.push("通胀持续侵蚀购买力");
  }
  if (reasons.length === 0) {
    reasons.push("模拟参数下资金将在目标年限前耗尽");
  }
  return reasons;
}

export default function ResultSidebar({ result, formState }: Props) {
  const depletionReasons = getDepletionReasons(result, formState);
  const topSuggestions = result.suggestions.slice(0, 3);
  const hasMaterialRisk = result.riskLevel !== "low";

  return (
    <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
      <h3 className="flex items-center gap-2 font-bold text-slate-950">
        <FileText className="h-5 w-5 text-primary-600" />
        结果摘要
      </h3>

      <p className="text-sm leading-7 text-slate-600">
        {result.summaryText}
      </p>

      <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
        <h4 className="mb-2 text-sm font-bold text-red-600">{hasMaterialRisk ? "资金耗尽原因" : "资金压力来源"}</h4>
        <ul className="space-y-1.5 text-sm text-slate-600">
          {depletionReasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red-400" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {hasMaterialRisk && result.riskReasons.length > 0 && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-bold text-red-700">风险提示</span>
          </div>
          <p className="text-sm leading-6 text-red-700">
            当前财务状况不可持续，建议尽快优化支出或提升收入以延长可持续时间。
          </p>
        </div>
      )}

      {topSuggestions.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-bold text-slate-950">优先建议（按优先级）</h4>
          <ul className="space-y-2">
            {topSuggestions.map((s, i) => (
              <li key={`${s.type}-${i}`} className="flex items-start gap-2 text-sm text-slate-600">
                <span className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  i === 0 ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  {i + 1}
                </span>
                <span className="leading-5">{s.title}，{s.description.replace(/^[\s\S]*?，/, "")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
