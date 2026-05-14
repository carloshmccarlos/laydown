import Link from "next/link";
import { Rocket, Eye } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 md:p-8">
          <div className="grid md:grid-cols-[160px_1fr_auto] gap-6 items-center">
            <div className="hidden md:flex h-24 items-center justify-center">
              <Rocket className="w-20 h-20 text-primary-500" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-950">现在开始，找到适合你的幸福生活方案</h2>
              <p className="text-slate-600">通过实际测算，快速理解结果与逻辑。</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/setup"
                className="inline-flex items-center justify-center px-7 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                开始测算
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white border border-blue-200 text-primary-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                先看看示例结果
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
