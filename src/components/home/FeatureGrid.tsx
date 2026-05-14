import { BarChart3, TrendingUp, Lightbulb, FolderOpen, SlidersHorizontal, Bookmark, Scale, Download } from "lucide-react";

const features = [
  { icon: BarChart3, title: "可维持到几岁", desc: "结合收入、支出、存款和收益率进行年度模拟" },
  { icon: TrendingUp, title: "年龄-资金曲线", desc: "直观看到资金何时增长、下降或耗尽" },
  { icon: Lightbulb, title: "调整建议", desc: "告诉你需要增加多少收入、减少多少支出或补充多少本金" },
  { icon: FolderOpen, title: "方案对比与保存", desc: "保存你的方案，比较哪种更适合你" },
];

const tools = [
  { icon: SlidersHorizontal, title: "滑杆模拟", desc: "拖动滑杆，实时查看结果变化" },
  { icon: Bookmark, title: "方案保存", desc: "保存你的方案，随时查看" },
  { icon: Scale, title: "方案对比", desc: "最多对比 5 个方案，一目了然" },
  { icon: Download, title: "生成海报", desc: "导出结果页有效内容" },
];

export default function FeatureGrid() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-950 text-center mb-8">你会得到什么</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-blue-100 p-5">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4 border border-primary-100">
                <f.icon className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-950 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-6">{f.desc}</p>
            </div>
          ))}
        </div>
        <h3 className="text-lg font-bold text-gray-950 mb-6">更多实用工具</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((t) => (
            <div key={t.title} className="bg-white rounded-xl border border-blue-100 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                <t.icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-950">{t.title}</h4>
                <p className="text-sm text-slate-600 mt-1 leading-6">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
