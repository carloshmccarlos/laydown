"use client";

import { useEffect, useMemo, useState } from "react";
import { CalculatorFormState, CalculatorResult } from "@/lib/types";
import { calculateResult } from "@/lib/engine/calculator";
import { getCityByCode } from "@/lib/data/cities";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  initialInput: CalculatorFormState;
  initialResult: CalculatorResult;
  onResultChange: (input: CalculatorFormState, result: CalculatorResult) => void;
}

type NumericField =
  | "monthlySalaryIncome"
  | "monthlyPassiveIncome"
  | "monthlyExpense"
  | "currentSavings"
  | "annualReturnRate"
  | "annualInflationRate"
  | "targetAge";

export default function ScenarioSimulator({ initialInput, initialResult, onResultChange }: Props) {
  const [input, setInput] = useState<CalculatorFormState>(initialInput);
  const [quickResult, setQuickResult] = useState<CalculatorResult>(initialResult);

  const city = useMemo(() => getCityByCode(input.cityCode) || getCityByCode("shanghai")!, [input.cityCode]);

  useEffect(() => {
    try {
      const nextResult = calculateResult(input, city);
      setQuickResult(nextResult);
      onResultChange(input, nextResult);
    } catch {
      // Keep the previous result visible while a slider is in an invalid transient state.
    }
  }, [city, input, onResultChange]);

  const updateField = (field: NumericField, value: number) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const sliders = [
    {
      label: "月收入（税后）",
      field: "monthlySalaryIncome" as const,
      min: 0,
      max: 100000,
      step: 100,
      value: input.monthlySalaryIncome,
      disabled: input.incomeType === "without_salary",
    },
    {
      label: "被动收入",
      field: "monthlyPassiveIncome" as const,
      min: 0,
      max: 50000,
      step: 100,
      value: input.monthlyPassiveIncome,
    },
    {
      label: "月支出",
      field: "monthlyExpense" as const,
      min: 1000,
      max: 100000,
      step: 100,
      value: input.monthlyExpense,
    },
    {
      label: "当前存款",
      field: "currentSavings" as const,
      min: 0,
      max: 10000000,
      step: 10000,
      value: input.currentSavings,
    },
    {
      label: "年化收益率",
      field: "annualReturnRate" as const,
      min: -0.1,
      max: 0.15,
      step: 0.001,
      value: input.annualReturnRate,
      format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
    {
      label: "通货膨胀率",
      field: "annualInflationRate" as const,
      min: 0,
      max: 0.1,
      step: 0.001,
      value: input.annualInflationRate,
      format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
    ...(input.mode === "target_projection"
      ? [
          {
            label: "目标年龄",
            field: "targetAge" as const,
            min: input.currentAge + 1,
            max: 120,
            step: 1,
            value: input.targetAge || input.currentAge + 1,
            format: (value: number) => `${value} 岁`,
          },
        ]
      : []),
  ];

  return (
    <div className="rounded-xl border border-primary-100 bg-white p-6 shadow-sm shadow-slate-100">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-bold text-slate-950">滑杆模拟</h3>
            <p className="text-xs text-slate-500">拖动滑块调整参数，实时查看结果变化</p>
          </div>
        </div>
        <div className="inline-flex items-center rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
          调整后可维持到 {quickResult.sustainableAge} 岁
        </div>
      </div>

      <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {sliders.map((slider) => (
          <div key={slider.field} className={cn(slider.disabled && "opacity-50 pointer-events-none")}>
            <div className="mb-2 flex justify-between gap-3">
              <label className="text-sm font-medium text-slate-700">{slider.label}</label>
              <span className="text-sm font-bold text-primary-600">
                {slider.format ? slider.format(slider.value) : `¥${slider.value.toLocaleString()}`}
              </span>
            </div>
            <input
              type="range"
              data-testid={`simulator-${slider.field}`}
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={slider.value}
              onChange={(event) => updateField(slider.field, Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary-600"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>{slider.format ? slider.format(slider.min) : `¥${slider.min.toLocaleString()}`}</span>
              <span>{slider.format ? slider.format(slider.max) : `¥${slider.max.toLocaleString()}`}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
