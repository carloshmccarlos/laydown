"use client";

import Link from "next/link";
import { TrendingUp, Target, Check } from "lucide-react";

const modes = [
  {
    key: "current_projection",
    title: "按现状推算",
    desc: "我现在这样能维持到几岁？",
    icon: TrendingUp,
    features: ["适合想了解当前状态", "支持有薪资 / 无薪资", "输出可持续年龄"],
    color: "bg-blue-50 border-blue-200 text-blue-600",
    btnColor: "bg-blue-600 hover:bg-blue-700",
  },
  {
    key: "target_projection",
    title: "按目标推算",
    desc: "我想维持到目标年龄，需要怎样调整？",
    icon: Target,
    features: ["适合有明确目标", "自动计算收入/支出缺口", "支持目标生活等级"],
    color: "bg-green-50 border-green-200 text-green-600",
    btnColor: "bg-green-600 hover:bg-green-700",
  },
];

export default function ModeSelector() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-950 text-center mb-8">先选你想知道什么</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {modes.map((mode) => (
            <div key={mode.key} className={`rounded-xl border p-6 ${mode.color.split(" ").slice(1).join(" ")}`}>
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-xl ${mode.color.split(" ")[0]} flex items-center justify-center shrink-0`}>
                  <mode.icon className={`w-7 h-7 ${mode.color.split(" ")[2]}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-950 mb-1">{mode.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{mode.desc}</p>
                  <ul className="space-y-2 mb-5">
                    {mode.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link
                href={`/setup?mode=${mode.key}`}
                className={`inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 text-white text-sm font-semibold rounded-lg ${mode.btnColor} transition-colors`}
              >
                进入此模式
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
