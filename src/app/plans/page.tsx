"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCalculatorStore } from "@/lib/store/calculatorStore";
import { Search, Eye, Pencil, Copy, Trash2, Scale, Check, PlusCircle, BarChart3, Lightbulb, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLivingLevelLabel, getLivingLevelColor } from "@/lib/engine/living-level";
import { getRiskLabel, getRiskColor } from "@/lib/engine/risk";
import { getCityByCode } from "@/lib/data/cities";

export default function PlansPage() {
  const router = useRouter();
  useEffect(() => { document.title = "管理我的幸福生活方案 | 幸福生活计算器"; }, []);
  const { plans, deletePlan, duplicatePlan, toggleComparePlan, comparePlanIds, setFormState, setResult, updatePlan } = useCalculatorStore();
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const filtered = plans.filter((p) => {
    const cityName = getCityByCode(p.formState.cityCode)?.cityName || p.formState.cityCode;
    if (search && !p.name.includes(search) && !p.formState.cityCode.includes(search) && !cityName.includes(search)) return false;
    if (filterMode !== "all" && p.formState.mode !== filterMode) return false;
    return true;
  });

  const comparePlans = plans.filter((plan) => comparePlanIds.includes(plan.id));

  const handleView = (id: string) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;
    setFormState(plan.formState);
    setResult(plan.result);
    router.push("/result");
  };

  const startCompare = () => {
    if (comparePlanIds.length < 2) {
      alert("请至少选择 2 个方案进行对比");
      return;
    }
    router.push("/compare");
  };

  const commitName = (id: string) => {
    const trimmed = editValue.trim();
    if (trimmed) updatePlan(id, { name: trimmed });
    setEditingName(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-950 mb-3 tracking-tight">我的方案</h1>
          <p className="text-slate-600">保存、管理和复用你的幸福生活测算方案</p>
        </div>
        <button
          onClick={() => router.push("/setup")}
          data-testid="new-plan-button"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
        >
          <PlusCircle className="w-4 h-4" />
          新建方案
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            data-testid="plan-search-input"
            placeholder="搜索方案名称、城市或备注"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-blue-100 rounded-lg text-sm bg-white"
          />
        </div>
        <button
          onClick={() => setFilterMode("all")}
          className={cn("px-4 py-2 text-sm rounded-lg border", filterMode === "all" ? "bg-primary-50 border-primary-500 text-primary-600" : "bg-white border-blue-100 text-gray-600")}
        >
          全部
        </button>
        <button
          onClick={() => setFilterMode("current_projection")}
          className={cn("px-4 py-2 text-sm rounded-lg border", filterMode === "current_projection" ? "bg-primary-50 border-primary-500 text-primary-600" : "bg-white border-blue-100 text-gray-600")}
        >
          按现状推算
        </button>
        <button
          onClick={() => setFilterMode("target_projection")}
          className={cn("px-4 py-2 text-sm rounded-lg border", filterMode === "target_projection" ? "bg-primary-50 border-primary-500 text-primary-600" : "bg-white border-blue-100 text-gray-600")}
        >
          按目标推算
        </button>
        {comparePlanIds.length > 0 && (
          <button
            onClick={startCompare}
            data-testid="start-compare-button"
            className="px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-2"
          >
            <Scale className="w-4 h-4" />
            开始对比 ({comparePlanIds.length})
          </button>
        )}
      </div>

      {comparePlanIds.length > 0 && (
        <div className="bg-white border border-blue-100 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-gray-950">已选择 {comparePlanIds.length} 个方案加入对比</span>
            {comparePlans.map((plan) => (
              <span key={plan.id} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-100 text-sm text-slate-700">
                <Check className="w-4 h-4 text-primary-600" />
                {plan.name}
              </span>
            ))}
          </div>
          <button
            onClick={startCompare}
            data-testid="start-compare-selected-button"
            className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 flex items-center justify-center gap-2"
          >
            <Scale className="w-4 h-4" />
            开始对比 ({comparePlanIds.length})
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-blue-100 text-center py-20">
            <div className="text-slate-500 mb-4">暂无保存的方案</div>
            <button
              onClick={() => router.push("/setup")}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              开始测算
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((plan) => {
              const cityName = getCityByCode(plan.formState.cityCode)?.cityName || plan.formState.cityCode;
              return (
            <div key={plan.id} className="bg-white rounded-xl border border-blue-100 p-5">
              <div className="flex items-start justify-between mb-3">
                {editingName === plan.id ? (
                  <input
                    data-testid="plan-name-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => commitName(plan.id)}
                    onKeyDown={(e) => e.key === "Enter" && commitName(plan.id)}
                    className="text-sm font-bold border rounded px-2 py-1"
                    autoFocus
                  />
                ) : (
                  <h3 className="font-bold text-gray-950 text-lg">{plan.name}</h3>
                )}
                <button
                  onClick={() => toggleComparePlan(plan.id)}
                  data-testid="toggle-compare-plan"
                  className={cn(
                    "w-6 h-6 rounded border flex items-center justify-center",
                    comparePlanIds.includes(plan.id) ? "bg-primary-600 border-primary-600 text-white" : "border-gray-300"
                  )}
                >
                  {comparePlanIds.includes(plan.id) && <Check className="w-3 h-3" />}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                  {plan.formState.mode === "current_projection" ? "按现状推算" : "按目标推算"}
                </span>
                <span className={cn("px-2 py-0.5 text-xs rounded-full", plan.formState.incomeType === "with_salary" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600")}>
                  {plan.formState.incomeType === "with_salary" ? "有薪资" : "无薪资"}
                </span>
                <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full">
                  {cityName}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-950">{plan.result.sustainableAge} 岁</div>
                  <div className="text-xs text-gray-500">可维持到</div>
                </div>
                <div>
                  <div className={cn("text-sm font-bold px-2 py-0.5 rounded border", getLivingLevelColor(plan.result.currentLivingLevel))}>
                    {plan.result.currentLivingLevel}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{getLivingLevelLabel(plan.result.currentLivingLevel)}</div>
                </div>
                <div>
                  <div className={cn("text-sm font-bold", getRiskColor(plan.result.riskLevel).split(" ")[0])}>
                    {getRiskLabel(plan.result.riskLevel)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">风险等级</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 mb-3">
                <div>最终余额 <span className="block text-primary-600 font-bold">¥{Math.round((plan.result.finalBalance || plan.formState.currentSavings) / 10000).toLocaleString()}万</span></div>
                <div>更新于 <span className="block text-slate-700">{new Date(plan.updatedAt).toLocaleString()}</span></div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleView(plan.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-blue-100 hover:bg-blue-50">
                  <Eye className="w-3 h-3" /> 查看
                </button>
                <button data-testid="rename-plan-button" onClick={() => { setEditingName(plan.id); setEditValue(plan.name); }} className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-blue-100 hover:bg-blue-50">
                  <Pencil className="w-3 h-3" />
                </button>
                <button data-testid="duplicate-plan-button" onClick={() => duplicatePlan(plan.id)} className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-blue-100 hover:bg-blue-50">
                  <Copy className="w-3 h-3" />
                </button>
                <button data-testid="delete-plan-button" onClick={() => deletePlan(plan.id)} className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-red-50 text-red-600">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
              );
            })}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-blue-100 p-5">
            <h3 className="font-bold text-gray-950 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              方案概览
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">已保存方案</span><span className="font-bold text-primary-600">{plans.length} 个</span></div>
              <div className="flex justify-between"><span className="text-slate-500">加入对比</span><span className="font-bold text-slate-800">{comparePlanIds.length} 个方案</span></div>
              <button className="w-full px-4 py-2 border border-blue-200 rounded-lg text-primary-700 font-medium flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                管理默认方案
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-100 p-5">
            <h3 className="font-bold text-gray-950 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary-600" />
              快速提示
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />将常用方案设为默认，便于快速查看</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />支持复制方案，快速调整参数</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />加入对比可同时分析多个方案</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-blue-100 p-5">
            <h3 className="font-bold text-gray-950 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              最近活动
            </h3>
            <div className="space-y-3">
              {plans.slice(0, 3).map((plan) => (
                <div key={plan.id} className="text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="font-medium text-slate-800">{plan.name}</div>
                  <div className="text-xs text-slate-500">{new Date(plan.updatedAt).toLocaleString()}</div>
                </div>
              ))}
              {plans.length === 0 && <div className="text-sm text-slate-500">暂无活动</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
