import Link from "next/link";
import { Calculator } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <span className="block text-sm font-bold text-gray-950">幸福生活计算器</span>
              <span className="block text-xs text-slate-500">本工具仅用于生活成本与资金模拟，不构成投资建议。</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/faq" className="hover:text-gray-900">关于我们</Link>
            <Link href="/faq" className="hover:text-gray-900">隐私说明</Link>
            <Link href="/faq" className="hover:text-gray-900">使用条款</Link>
            <Link href="/faq" className="hover:text-gray-900">常见问题</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
