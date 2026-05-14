"use client";

import Link from "next/link";
import { Calculator, Eye, ShieldCheck, Lock, Info, WalletCards } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center min-w-0">
          <div className="min-w-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-950 leading-tight mb-5 tracking-tight break-all">
              算一算，你现在的生活能维持到几岁
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-8 max-w-xl break-all">
              输入年龄、城市、收入、支出和存款，快速测算你的生活可持续性，并获得清晰的调整建议。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/setup"
                className="inline-flex items-center gap-2 px-7 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm shadow-blue-200"
              >
                <Calculator className="w-5 h-5" />
                立即开始
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-7 py-3 border border-blue-200 text-primary-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Eye className="w-5 h-5" />
                查看示例
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                数据本地计算
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                隐私安全
              </span>
              <span className="flex items-center gap-1">
                <Info className="w-4 h-4" />
                结果仅供参考
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-200 p-4 md:p-5 shadow-sm min-w-0">
            <div className="grid md:grid-cols-[1fr_1.2fr] gap-4 mb-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="text-sm text-slate-600 mb-2">生活等级</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-xl">
                    L3
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-700">普通稳定</div>
                    <div className="text-sm text-slate-500">当前生活等级</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0">
                <div className="rounded-lg border border-blue-100 p-3 text-center">
                  <div className="text-sm text-slate-500">可维持到</div>
                  <div className="text-2xl font-bold text-primary-700">68</div>
                  <div className="text-xs text-slate-500">岁</div>
                </div>
                <div className="rounded-lg border border-blue-100 p-3 text-center min-w-0">
                  <div className="text-sm text-slate-500">月结余</div>
                  <div className="text-2xl font-bold text-green-600">+3,450</div>
                  <div className="text-xs text-slate-500">元</div>
                </div>
                <div className="rounded-lg border border-blue-100 p-3 text-center min-w-0">
                  <div className="text-sm text-slate-500">资产总额</div>
                  <div className="text-2xl font-bold text-primary-700">128万</div>
                  <div className="text-xs text-slate-500">元</div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-[1.5fr_0.85fr] gap-4 min-w-0">
              <div className="rounded-lg border border-blue-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-bold text-gray-950">年龄-资金曲线</div>
                  <div className="text-xs text-slate-500">单位：万元</div>
                </div>
                <div className="h-48 flex items-end justify-center gap-1 px-2 pb-4 border-b border-dashed border-slate-200">
                  {[34, 45, 56, 66, 77, 86, 93, 96, 94, 84, 65, 38, 7].map((h, i) => (
                    <div
                      key={i}
                    className="flex-1 min-w-0 rounded-t bg-primary-500"
                      style={{ height: `${h}%`, opacity: i > 9 ? 0.7 : 1 }}
                    />
                  ))}
                </div>
                <div className="mt-3 rounded-lg bg-green-50 text-green-700 text-sm px-3 py-2 flex items-center gap-2">
                  <WalletCards className="w-4 h-4" />
                  建议：适当降低支出或提高收益率，可进一步延长可维持年龄。
                </div>
              </div>
              <div className="rounded-lg border border-blue-100 p-4">
                <div className="font-bold text-gray-950 mb-3">关键输入</div>
                {[
                  ["年龄", "35 岁"],
                  ["城市", "上海"],
                  ["月收入", "¥18,000"],
                  ["月支出", "¥14,550"],
                  ["存款", "¥1,280,000"],
                  ["收益率", "3.5%"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-slate-100 py-2 text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
