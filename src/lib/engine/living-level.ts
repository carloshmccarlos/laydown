import { CityCostProfile, LivingLevel } from "@/lib/types";

export const LIVING_LEVELS: Record<LivingLevel, { label: string; description: string; multiplier: number }> = {
  L1: { label: "极简生存", description: "只覆盖基础吃住交通，几乎没有弹性消费。", multiplier: 0.55 },
  L2: { label: "基础生活", description: "低欲望生活，覆盖基本生活并保留少量弹性。", multiplier: 0.75 },
  L3: { label: "普通稳定", description: "正常租房、餐饮、交通和少量娱乐支出。", multiplier: 1 },
  L4: { label: "舒适生活", description: "居住、餐饮、社交和兴趣支出更充足。", multiplier: 1.35 },
  L5: { label: "富足自由", description: "生活品质较高，消费自由度更强。", multiplier: 1.8 },
};

export function calculateLivingLevel(monthlyExpense: number, city: CityCostProfile): LivingLevel {
  const ratio = monthlyExpense / city.baseMonthlyCost;
  if (ratio < 0.6) return "L1";
  if (ratio < 0.85) return "L2";
  if (ratio < 1.2) return "L3";
  if (ratio < 1.6) return "L4";
  return "L5";
}

export function getMonthlyCostByLivingLevel(level: LivingLevel, city: CityCostProfile): number {
  return Math.round(city.baseMonthlyCost * LIVING_LEVELS[level].multiplier);
}

export function compareLivingLevels(current: LivingLevel, target: LivingLevel) {
  const order: LivingLevel[] = ["L1", "L2", "L3", "L4", "L5"];
  const currentIndex = order.indexOf(current);
  const targetIndex = order.indexOf(target);
  return {
    diff: targetIndex - currentIndex,
    isUpgrade: targetIndex > currentIndex,
    isDowngrade: targetIndex < currentIndex,
    isSame: targetIndex === currentIndex,
  };
}

export function getLivingLevelLabel(level: LivingLevel): string {
  return LIVING_LEVELS[level].label;
}

export function getLivingLevelDescription(level: LivingLevel): string {
  return LIVING_LEVELS[level].description;
}

export function getLivingLevelColor(level: LivingLevel): string {
  const colors: Record<LivingLevel, string> = {
    L1: "text-gray-500 bg-gray-50 border-gray-200",
    L2: "text-blue-600 bg-blue-50 border-blue-200",
    L3: "text-green-600 bg-green-50 border-green-200",
    L4: "text-amber-600 bg-amber-50 border-amber-200",
    L5: "text-red-600 bg-red-50 border-red-200",
  };
  return colors[level];
}
