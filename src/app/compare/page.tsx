"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCalculatorStore } from "@/lib/store/calculatorStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { ArrowLeft, Check, Star, Save, RotateCcw } from "lucide-react";
import { getLivingLevelLabel } from "@/lib/engine/living-level";
import { getRiskLabel } from "@/lib/engine/risk";
import { getCityByCode } from "@/lib/data/cities";

export default function ComparePage() {
  const router = useRouter();
  useEffect(() => { document.title = "方案对比分析 | 幸福生活计算器"; }, []);
  const { plans, comparePlanIds, clearComparePlans } = useCalculatorStore();

  const comparePlans = useMemo(
    () => plans.filter((p) => comparePlanIds.includes(p.id)),
    [plans, comparePlanIds]
  );

  if (comparePlans.length < 2) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">请至少选择 2 个方案进行对比</p>
        <button
          onClick={() => router.push("/plans")}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          返回方案列表
        </button>
      </div>
    );
  }

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const fundCurveData = (() => {
    const allAges = new Set<number>();
    comparePlans.forEach((p) => {
      p.result.yearlyResults.forEach((y) => allAges.add(y.age));
    });
    const ages = Array.from(allAges).sort((a, b) => a - b);
    return ages.map((age) => {
      const point: Record<string, number | string> = { age };
      comparePlans.forEach((p) => {
        const year = p.result.yearlyResults.find((y) => y.age === age);
        point[p.name] = year ? Math.round(year.endBalance / 10000) : 0;
      });
      return point;
    });
  })();

  const balanceData = comparePlans.map((p, i) => ({
    name: p.name,
    balance: Math.round((p.result.finalBalance || p.result.yearlyResults[p.result.yearlyResults.length - 1]?.endBalance || 0) / 10000),
    fill: colors[i % colors.length],
  }));

  const riskData = comparePlans.map((p, i) => ({
    name: p.name,
    risk: p.result.riskLevel === "low" ? 1 : p.result.riskLevel === "medium" ? 2 : p.result.riskLevel === "high" ? 3 : 4,
    fill: colors[i % colors.length],
  }));

  const bestPlan = comparePlans.reduce((best, p) => {
    const bestScore =
      (best.result.sustainableAge - best.formState.currentAge) * 100 -
      (best.result.riskLevel === "low" ? 0 : best.result.riskLevel === "medium" ? 10 : best.result.riskLevel === "high" ? 30 : 50);
    const pScore =
      (p.result.sustainableAge - p.formState.currentAge) * 100 -
      (p.result.riskLevel === "low" ? 0 : p.result.riskLevel === "medium" ? 10 : p.result.riskLevel === "high" ? 30 : 50);
    return pScore > bestScore ? p : best;
  }, comparePlans[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-950 mb-3 tracking-tight">方案对比</h1>
          <p className="text-slate-600">把多个方案放在一起，快速找到更适合你的选择</p>
        </div>
        <button
          onClick={() => router.push("/plans")}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 text-primary-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          返回方案列表
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {comparePlans.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center gap-3 p-4 rounded-xl border text-sm bg-white"
            style={{ borderColor: colors[i % colors.length], backgroundColor: colors[i % colors.length] + "10" }}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
            <div>
              <div className="font-bold text-gray-950">{p.name}</div>
              <div className="text-xs text-slate-500">
                {getLivingLevelLabel(p.result.currentLivingLevel)} · {getCityByCode(p.formState.cityCode)?.cityName || p.formState.cityCode}
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => router.push("/plans")} className="min-h-[74px] rounded-xl border border-blue-200 bg-white text-primary-600 font-semibold">
          添加方案
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-blue-100 p-5 text-center">
          <div className="text-sm text-gray-500 mb-1">最久可维持年龄</div>
          <div className="text-2xl font-bold text-primary-600">
            {Math.max(...comparePlans.map((p) => p.result.sustainableAge))} 岁
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {comparePlans.reduce((max, p) => (p.result.sustainableAge > max.result.sustainableAge ? p : max)).name}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-green-100 p-5 text-center">
          <div className="text-sm text-gray-500 mb-1">最低风险方案</div>
          <div className="text-lg font-bold text-green-600">
            {comparePlans
              .filter((p) => p.result.riskLevel === "low")
              .map((p) => p.name)
              .join(", ") || comparePlans[0].name}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-orange-100 p-5 text-center">
          <div className="text-sm text-gray-500 mb-1">推荐方案</div>
          <div className="text-lg font-bold text-primary-600">{bestPlan.name}</div>
          <div className="text-xs text-gray-400 mt-1">综合风险与可持续性</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-blue-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">对比项</th>
                {comparePlans.map((p, i) => (
                  <th key={p.id} className="px-4 py-3 text-left font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                      {p.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { label: "模式", get: (p: (typeof comparePlans)[0]) => (p.formState.mode === "current_projection" ? "按现状推算" : "按目标推算") },
                { label: "收入类型", get: (p: (typeof comparePlans)[0]) => (p.formState.incomeType === "with_salary" ? "有薪资收入" : "无薪资收入") },
                { label: "城市", get: (p: (typeof comparePlans)[0]) => getCityByCode(p.formState.cityCode)?.cityName || p.formState.cityCode },
                { label: "当前生活等级", get: (p: (typeof comparePlans)[0]) => `${p.result.currentLivingLevel} ${getLivingLevelLabel(p.result.currentLivingLevel)}` },
                { label: "月支出", get: (p: (typeof comparePlans)[0]) => `¥${p.formState.monthlyExpense.toLocaleString()}` },
                { label: "可维持到几岁", get: (p: (typeof comparePlans)[0]) => `${p.result.sustainableAge} 岁` },
                { label: "目标是否可达", get: (p: (typeof comparePlans)[0]) => (p.result.isSustainableToTarget === undefined ? "-" : p.result.isSustainableToTarget ? "可达" : "不可达") },
                { label: "风险等级", get: (p: (typeof comparePlans)[0]) => getRiskLabel(p.result.riskLevel) },
              ].map((row) => (
                <tr key={row.label}>
                  <td className="px-4 py-3 font-medium text-gray-700">{row.label}</td>
                  {comparePlans.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-gray-600">{row.get(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-blue-100 p-5">
          <h3 className="font-bold text-gray-950 mb-4">资金曲线对比</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fundCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                {comparePlans.map((p, i) => (
                  <Line key={p.id} type="monotone" dataKey={p.name} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-blue-100 p-5">
          <h3 className="font-bold text-gray-950 mb-4">最终余额与风险对比</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={balanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => `${value} 万`} />
                  <Bar dataKey="balance">
                    {balanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 4]} />
                  <Tooltip formatter={(value: number) => `${value} 级`} />
                  <Bar dataKey="risk">
                    {riskData.map((entry, index) => (
                      <Cell key={`risk-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl border border-green-200 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">系统推荐：{bestPlan.name} 更稳妥</h3>
            <p className="text-sm text-gray-600 mb-3">
              在保证目标可达的前提下，{bestPlan.name} 的风险更低、维持时间更长，更适合追求财务安全的你。
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                可维持到 {bestPlan.result.sustainableAge} 岁
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                风险等级 {getRiskLabel(bestPlan.result.riskLevel)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => router.push("/plans")}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          保存对比结果
        </button>
        <button
          onClick={() => { clearComparePlans(); router.push("/plans"); }}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          重新选择方案
        </button>
      </div>
    </div>
  );
}
