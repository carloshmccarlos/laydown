import { LIVING_LEVELS } from "@/lib/engine/living-level";
import { LivingLevel } from "@/lib/types";
import { Utensils, Home, ShieldCheck, Sofa, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

const levelIcons = {
  L1: Utensils,
  L2: Home,
  L3: ShieldCheck,
  L4: Sofa,
  L5: Gem,
};

const levelStyles: Record<LivingLevel, string> = {
  L1: "text-slate-500 bg-slate-50 border-slate-200",
  L2: "text-blue-600 bg-blue-50 border-blue-200",
  L3: "text-green-600 bg-green-50 border-green-200",
  L4: "text-orange-600 bg-orange-50 border-orange-200",
  L5: "text-red-600 bg-red-50 border-red-200",
};

export default function LivingLevelPreview() {
  const levels = Object.entries(LIVING_LEVELS) as [LivingLevel, typeof LIVING_LEVELS[LivingLevel]][];

  return (
    <section id="living-levels" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-950 mb-5">看懂你的生活等级</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {levels.map(([key, value]) => {
            const Icon = levelIcons[key];
            return (
              <div
                key={key}
                className={cn("bg-white rounded-xl border p-4 text-center", levelStyles[key])}
              >
                <div className="mx-auto mb-3 w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-current/20">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold">{key}</div>
                <div className="text-sm">{value.label}</div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
