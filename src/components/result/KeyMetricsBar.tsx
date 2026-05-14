"use client";

import { CalculatorFormState, CalculatorResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BarChart3, Briefcase, ShoppingCart, Landmark, TrendingUp, Timer } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Props {
  result: CalculatorResult;
  formState: CalculatorFormState;
}

const metrics: {
  label: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  getValue: (result: CalculatorResult, formState: CalculatorFormState) => string;
  show: (result: CalculatorResult) => boolean;
}[] = [
  {
    label: "月收入（税后）",
    icon: Briefcase,
    iconBg: "bg-blue-50",
    iconColor: "text-primary-600",
    getValue: (_r, fs) => `¥${fs.monthlySalaryIncome.toLocaleString()}`,
    show: (r) => r.incomeType === "with_salary",
  },
  {
    label: "月支出",
    icon: ShoppingCart,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    getValue: (_r, fs) => `¥${fs.monthlyExpense.toLocaleString()}`,
    show: () => true,
  },
  {
    label: "当前存款",
    icon: Landmark,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    getValue: (_r, fs) => `¥${fs.currentSavings.toLocaleString()}`,
    show: () => true,
  },
  {
    label: "年化收益率",
    icon: TrendingUp,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    getValue: (_r, fs) => `${(fs.annualReturnRate * 100).toFixed(1)}%`,
    show: () => true,
  },
  {
    label: "通胀率",
    icon: Timer,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    getValue: (_r, fs) => `${(fs.annualInflationRate * 100).toFixed(1)}%`,
    show: () => true,
  },
];

export default function KeyMetricsBar({ result, formState }: Props) {
  const visibleMetrics = metrics.filter((m) => m.show(result));

  return (
    <div className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm shadow-slate-100">
      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-950">
        <BarChart3 className="h-5 w-5 text-primary-600" />
        关键指标
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {visibleMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="flex min-h-24 flex-col items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-4">
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", m.iconBg)}>
                <Icon className={cn("h-5 w-5", m.iconColor)} />
              </div>
              <div className="min-w-0">
                <div className="mb-1 text-sm text-slate-500">{m.label}</div>
                <div className="whitespace-nowrap text-base font-bold tracking-tight text-slate-950 sm:text-lg">{m.getValue(result, formState)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
