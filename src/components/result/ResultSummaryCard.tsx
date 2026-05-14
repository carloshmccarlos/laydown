"use client";

import { CalculatorResult } from "@/lib/types";
import { getRiskLabel, getRiskDescription, getRiskColor } from "@/lib/engine/risk";
import { CalendarDays, Wallet, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  result: CalculatorResult;
}

export default function ResultSummaryCard({ result }: Props) {
  const monthlyGap = Math.abs(result.monthlySurplus);
  const hasGap = result.monthlySurplus < 0;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="relative overflow-hidden rounded-xl border border-primary-300 bg-white p-6">
        <div className="relative z-10">
          <div className="mb-2 text-sm font-medium text-slate-600">预计可持续到</div>
          <div className="text-5xl font-bold leading-none text-primary-600">
            {result.sustainableAge} <span className="text-3xl">岁</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            约 {result.yearsSustainable} 年
            <span className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-400" title="从当前年龄开始估算">i</span>
          </div>
        </div>
        <div className="absolute bottom-4 right-5 text-primary-100">
          <CalendarDays className="h-20 w-20" />
        </div>
      </div>

      <div className={cn("relative overflow-hidden rounded-xl border p-6", hasGap ? "border-red-200 bg-red-50/40" : "border-green-200 bg-green-50/40")}>
        <div className="relative z-10">
          <div className="mb-2 text-sm font-medium text-slate-600">资金缺口（每月）</div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className={cn("text-5xl font-bold leading-none", hasGap ? "text-red-600" : "text-green-600")}>
              {hasGap ? "-" : "+"}¥{monthlyGap.toLocaleString()}
            </span>
            <span className={cn("rounded bg-white px-2 py-1 text-sm font-semibold", hasGap ? "text-red-500" : "text-green-500")}>/月</span>
          </div>
          <div className="mt-4 text-sm font-medium text-slate-600">
            {hasGap ? "需要尽快调整收支结构" : "当前每月有结余"}
          </div>
        </div>
        <div className="absolute bottom-4 right-5 text-red-100">
          <Wallet className="h-20 w-20" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6">
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            风险等级
          </div>
          <div className={cn("text-4xl font-bold leading-none", getRiskColor(result.riskLevel).split(" ")[0])}>
            {getRiskLabel(result.riskLevel)}
          </div>
          <div className="mt-4 text-sm text-slate-600">{getRiskDescription(result.riskLevel)}</div>
          {result.riskLevel === "critical" && (
            <div className="mt-1 text-sm font-medium text-red-500">需要立即采取行动</div>
          )}
          {result.riskLevel === "high" && (
            <div className="mt-1 text-sm font-medium text-red-500">建议尽快调整</div>
          )}
        </div>
        <div className="absolute bottom-4 right-5 text-red-100">
          <ShieldAlert className="h-20 w-20" />
        </div>
      </div>
    </div>
  );
}
