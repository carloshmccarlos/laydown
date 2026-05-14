"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkPlus, Check, Download, RotateCcw } from "lucide-react";
import { CalculatorFormState, CalculatorResult, SavedPlan } from "@/lib/types";
import { generateId, useCalculatorStore } from "@/lib/store/calculatorStore";
import html2canvas from "html2canvas";

interface Props {
  result: CalculatorResult;
  formState: CalculatorFormState | null;
  posterTargetId?: string;
}

export default function ResultActions({ result, formState, posterTargetId = "result-poster-content" }: Props) {
  const router = useRouter();
  const { addPlan, toggleComparePlan } = useCalculatorStore();
  const [saved, setSaved] = useState(false);
  const [generatingPoster, setGeneratingPoster] = useState(false);

  const handleSave = () => {
    if (!formState) return;
    const plan: SavedPlan = {
      id: generateId(),
      name: `${formState.mode === "current_projection" ? "现状" : "目标"}方案 - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formState,
      result,
    };
    addPlan(plan);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const generatePoster = async () => {
    const target = document.getElementById(posterTargetId);
    if (!target) return;
    setGeneratingPoster(true);
    try {
      const canvas = await html2canvas(target, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        windowWidth: target.scrollWidth,
        windowHeight: target.scrollHeight,
      });
      const link = document.createElement("a");
      link.download = `幸福生活测算结果_${result.sustainableAge}岁.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setGeneratingPoster(false);
    }
  };

  const handleCompare = () => {
    if (!formState) return;
    const plan: SavedPlan = {
      id: generateId(),
      name: `${formState.mode === "current_projection" ? "现状" : "目标"}对比方案 - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formState,
      result,
    };
    addPlan(plan);
    toggleComparePlan(plan.id);
    router.push("/plans");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
      <h3 className="mb-4 font-bold text-slate-950">方案操作</h3>
      <div className="space-y-3">
        <button
          onClick={handleSave}
          data-testid="save-plan-button"
          className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-primary-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
            {saved ? <Check className="h-5 w-5 text-green-600" /> : <Bookmark className="h-5 w-5 text-primary-600" />}
          </div>
          <div>
            <div className="font-medium text-slate-950">{saved ? "已保存" : "保存方案"}</div>
            <div className="text-xs text-gray-500">保存当前方案，方便下次查看</div>
          </div>
        </button>

        <button
          onClick={handleCompare}
          data-testid="compare-plan-button"
          className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-primary-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
            <BookmarkPlus className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <div className="font-medium text-slate-950">加入对比</div>
            <div className="text-xs text-gray-500">保存并加入方案列表进行对比</div>
          </div>
        </button>

        <button
          onClick={generatePoster}
          disabled={generatingPoster}
          data-testid="generate-poster-button"
          className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-primary-50 disabled:opacity-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
            <Download className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <div className="font-medium text-slate-950">{generatingPoster ? "生成中..." : "生成海报"}</div>
            <div className="text-xs text-gray-500">导出当前结果页有效内容</div>
          </div>
        </button>

        <button
          onClick={() => router.push("/setup")}
          className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <RotateCcw className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <div className="font-medium text-slate-950">重新测算</div>
            <div className="text-xs text-gray-500">调整参数后重新计算</div>
          </div>
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
        <div className="text-xs text-green-700">
          <strong>数据仅用于生活成本与资金模拟，不构成投资建议。</strong>
        </div>
      </div>
    </div>
  );
}
