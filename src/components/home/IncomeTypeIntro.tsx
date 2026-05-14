import { Briefcase, Home } from "lucide-react";

const types = [
  {
    title: "有薪资收入",
    desc: "工资、自由职业、副业等主动收入",
    icon: Briefcase,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "无薪资收入",
    desc: "主要依靠存款、利息、租金或其他被动收入",
    icon: Home,
    color: "bg-green-50 text-green-600",
  },
];

export default function IncomeTypeIntro() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-950 text-center mb-8">支持两种收入状态</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {types.map((t) => (
            <div key={t.title} className="bg-white rounded-xl border border-blue-100 p-5 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg ${t.color.split(" ")[0]} flex items-center justify-center shrink-0`}>
                <t.icon className={`w-5 h-5 ${t.color.split(" ")[1]}`} />
              </div>
              <div>
                <h3 className="font-bold text-gray-950">{t.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
