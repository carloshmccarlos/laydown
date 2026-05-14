"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "功能介绍" },
  { href: "/#living-levels", label: "生活等级" },
  { href: "/plans", label: "方案对比" },
  { href: "/faq", label: "常见问题" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isWorkPage = ["/setup", "/result", "/plans", "/compare"].some((path) => pathname.startsWith(path));

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 border-b border-blue-100 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </span>
            <span className="text-lg font-bold text-gray-950">幸福生活计算器</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors py-5 border-b-2 border-transparent",
                  isActive(item.href)
                    ? "text-primary-600 border-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href={isWorkPage ? "/" : "/setup"}
              className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm shadow-blue-200"
            >
              {isWorkPage ? "返回首页" : "开始测算"}
            </Link>
          </div>

          <button
            aria-label="打开导航菜单"
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-blue-100 bg-white">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("block py-2 text-sm font-medium", isActive(item.href) ? "text-primary-600" : "text-gray-600")}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/setup"
              className="block py-2 text-sm font-medium text-primary-600"
              onClick={() => setMobileOpen(false)}
            >
              开始测算
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
