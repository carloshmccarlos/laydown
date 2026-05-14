"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Shield, Users, FileText, Rocket, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const faqs = [
  {
    question: "收益率怎么填？",
    answer: "请输入您预期的年化收益率（%）。可以根据您的投资组合预期收益填写，例如货币基金 2%~3%，债券/固收 3%~5%，股票/混合 5%~8%+ 等。",
  },
  {
    question: "生活等级如何计算？",
    answer: "生活等级由我们基于您设置的月支出，映射到标准生活参考区间（L1~L5），并结合收入与存款水平进行评估，帮助您判断当前及未来可支持的生活品质。",
  },
  {
    question: "为什么结果仅供参考？",
    answer: "测算结果基于您输入的参数进行数学模拟，未考虑突发事件、重大疾病、政策变化等不可预测因素。实际财务状况可能因多种因素而与测算结果存在差异。",
  },
  {
    question: "海报会包含哪些内容？",
    answer: "海报会导出结果页的有效内容，包括核心结论、资金曲线、滑杆模拟、调整建议、摘要和关键指标。",
  },
  {
    question: "可以保存多个方案吗？",
    answer: "可以。您最多可以保存 50 个方案，方便对比不同参数下的测算结果，找到最适合您的幸福生活节奏。",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState("faq");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-950 mb-3 tracking-tight">帮助与常见问题</h1>
        <p className="text-slate-600">了解计算逻辑、隐私说明与使用规则</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
            {[
              { key: "faq", icon: HelpCircle, label: "常见问题" },
              { key: "privacy", icon: Shield, label: "隐私说明" },
              { key: "about", icon: Users, label: "关于我们" },
              { key: "terms", icon: FileText, label: "使用条款" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                  activeTab === tab.key ? "bg-primary-50 text-primary-600 font-semibold" : "text-gray-600 hover:bg-blue-50"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeTab === "faq" && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-950 mb-4">常见问题</h2>
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-blue-100 overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-medium text-gray-950">{faq.question}</span>
                    <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", openIndex === i && "rotate-180")} />
                  </button>
                  {openIndex === i && (
                    <div className="px-5 pb-4 text-sm text-slate-600 leading-7">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="bg-white rounded-xl border border-green-100 p-6">
              <h2 className="text-xl font-bold text-gray-950 mb-4">隐私说明</h2>
              <div className="space-y-4 text-sm text-slate-600 leading-7">
                <p>我们重视您的隐私与数据安全，始终遵循“本地优先、最小必要”的原则。</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    所有输入与计算均在您的浏览器本地完成，不上传、不存储。
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    结果页支持生成海报，便于保存当前测算内容。
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    您可随时清除本地数据，或关闭浏览器退出。
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="bg-white rounded-xl border border-blue-100 p-6">
              <h2 className="text-xl font-bold text-gray-950 mb-4">关于产品</h2>
              <p className="text-sm text-slate-600 leading-7 mb-4">
                幸福生活计算器是一款帮助您评估财务自由与生活可持续性的工具。
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  提供多种收入类型与生活等级参考。
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  支持方案保存、对比、海报生成与示例查看。
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  我们不提供投资建议，结果仅供参考。
                </li>
              </ul>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="bg-white rounded-xl border border-orange-100 p-6">
              <h2 className="text-xl font-bold text-gray-950 mb-4">使用条款</h2>
              <p className="text-sm text-slate-600 leading-7 mb-4">使用本产品即表示您已阅读并同意以下要点：</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  本工具仅供个人参考，不构成任何投资、税务或法律建议。
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  请确保输入信息真实、准确，您对输入内容负责。
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  我们不对使用本工具导致的任何损失承担责任。
                </li>
              </ul>
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-white border border-blue-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-950">还有疑问？先开始测算，或者查看示例结果</h3>
            <p className="text-slate-600 mb-6">通过实际测算，快速理解结果与逻辑。</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/setup" className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700">
                开始测算
              </Link>
              <Link href="/demo" className="px-6 py-2 bg-white border border-blue-200 text-primary-700 font-medium rounded-lg hover:bg-blue-50 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                查看示例结果
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
