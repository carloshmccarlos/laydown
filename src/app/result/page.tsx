"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { CalculatorFormState, CalculatorResult } from "@/lib/types";
import { calculateResult } from "@/lib/engine/calculator";
import { getCityByCode } from "@/lib/data/cities";
import { useCalculatorStore } from "@/lib/store/calculatorStore";
import AdjustmentSuggestions from "@/components/result/AdjustmentSuggestions";
import FundCurveChart from "@/components/result/FundCurveChart";
import KeyMetricsBar from "@/components/result/KeyMetricsBar";
import ResultActions from "@/components/result/ResultActions";
import ResultInfoBar from "@/components/result/ResultInfoBar";
import ResultSidebar from "@/components/result/ResultSidebar";
import ResultSummaryCard from "@/components/result/ResultSummaryCard";
import ScenarioSimulator from "@/components/result/ScenarioSimulator";

const posterTargetId = "result-poster-content";

const steps = ["选择模式", "收入类型", "填写信息", "查看结果"];

export default function ResultPage() {
  const router = useRouter();
  const storeFormState = useCalculatorStore((s) => s.formState);
  const storeResult = useCalculatorStore((s) => s.result);
  const setFormStateStore = useCalculatorStore((s) => s.setFormState);
  const setResult = useCalculatorStore((s) => s.setResult);
  const [formState, setFormState] = useState<CalculatorFormState | null>(storeFormState);
  const [result, setLocalResult] = useState<CalculatorResult | null>(storeResult);

  useEffect(() => {
    if (!storeFormState) {
      router.push("/setup");
      return;
    }

    setFormState(storeFormState);
    if (storeResult) {
      setLocalResult(storeResult);
      return;
    }

    const city = getCityByCode(storeFormState.cityCode) || getCityByCode("shanghai")!;
    try {
      const calculated = calculateResult(storeFormState, city);
      setResult(calculated);
      setLocalResult(calculated);
    } catch {
      router.push("/setup");
    }
  }, [router, setResult, storeFormState, storeResult]);

  const handleResultChange = useCallback(
    (newInput: CalculatorFormState, newResult: CalculatorResult) => {
      setFormState(newInput);
      setFormStateStore(newInput);
      setLocalResult(newResult);
      setResult(newResult);
    },
    [setFormStateStore, setResult]
  );

  if (!formState || !result) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-pulse text-slate-400">加载中...</div>
      </div>
    );
  }

  return (
    <main className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_380px)]">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-8 hidden items-start justify-center gap-4 md:flex">
          {steps.map((label, index) => (
            <div key={label} className="flex items-start gap-4">
              <div className="text-center">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-primary-600 bg-white text-sm font-bold text-primary-600 shadow-sm">
                  {index < 3 ? (
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-primary-600 text-white">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                  ) : (
                    4
                  )}
                </div>
                <div className="mt-2 text-xs font-medium text-slate-500">{label}</div>
              </div>
              {index < steps.length - 1 && <div className="mt-4 h-px w-28 bg-primary-500" />}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-950">测算结果</h1>
          <p className="text-sm text-slate-600">根据你的输入，计算出当前财务状况和可持续时间</p>
        </div>

        <div id={posterTargetId} className="space-y-6">
          <ResultSummaryCard result={result} />
          <ResultInfoBar result={result} formState={formState} />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <FundCurveChart result={result} />
            <ResultSidebar result={result} formState={formState} />
          </div>

          <KeyMetricsBar result={result} formState={formState} />
          <ScenarioSimulator initialInput={formState} initialResult={result} onResultChange={handleResultChange} />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <AdjustmentSuggestions result={result} />
            <ResultActions result={result} formState={formState} posterTargetId={posterTargetId} />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-primary-200 bg-primary-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 ring-1 ring-primary-100">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">继续调整，找到更适合你的幸福生活方案</h2>
              <p className="mt-1 text-sm text-slate-600">微调参数，验证不同组合。</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/setup")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-primary-700"
          >
            调整参数再试试
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
