import { CalculatorFormState, RiskLevel, YearlySimulationResult } from "@/lib/types";
import { calculateMonthlySurplus } from "./simulation";

export function calculateRiskLevel(
  input: CalculatorFormState,
  yearlyResults: YearlySimulationResult[]
): { riskLevel: RiskLevel; reasons: string[] } {
  const reasons: string[] = [];
  const last = yearlyResults[yearlyResults.length - 1];
  const depleted = yearlyResults.find((item) => item.isDepleted);
  let score = 0;

  if (depleted) {
    const yearsToDepletion = depleted.age - input.currentAge;
    if (yearsToDepletion <= 5) {
      score += 4;
      reasons.push("资金可能在 5 年内耗尽");
    } else {
      score += 3;
      reasons.push("模拟周期内资金会耗尽");
    }
  }

  if (last && last.endBalance >= 0) {
    const annualExpense = input.monthlyExpense * 12;
    const safetyYears = annualExpense > 0 ? last.endBalance / annualExpense : 0;
    if (safetyYears < 1) {
      score += 3;
      reasons.push("最终资金安全垫不足 1 年支出");
    } else if (safetyYears < 3) {
      score += 2;
      reasons.push("最终资金安全垫不足 3 年支出");
    } else {
      reasons.push("资金安全垫相对充足");
    }
  }

  const monthlySurplus = calculateMonthlySurplus(input);
  if (monthlySurplus < 0) {
    score += 1;
    reasons.push("当前每月现金流为负，需要消耗存款");
  }

  if (input.annualReturnRate > 0.08) {
    score += 1;
    reasons.push("收益率假设较高，结果可能偏乐观");
  }

  const incomeGrowth =
    input.incomeType === "with_salary"
      ? Math.max(input.annualSalaryGrowthRate, input.annualPassiveIncomeGrowthRate)
      : input.annualPassiveIncomeGrowthRate;
  if (input.annualInflationRate > incomeGrowth) {
    score += 1;
    reasons.push("通货膨胀率高于收入增长率");
  }

  if (score >= 4) return { riskLevel: "critical", reasons };
  if (score >= 3) return { riskLevel: "high", reasons };
  if (score >= 1) return { riskLevel: "medium", reasons };
  return { riskLevel: "low", reasons };
}

export function getRiskLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    low: "较低",
    medium: "中等",
    high: "高",
    critical: "极高",
  };
  return labels[level];
}

export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    low: "text-green-600 bg-green-50 border-green-200",
    medium: "text-amber-600 bg-amber-50 border-amber-200",
    high: "text-red-600 bg-red-50 border-red-200",
    critical: "text-red-800 bg-red-100 border-red-300",
  };
  return colors[level];
}

export function getRiskDescription(level: RiskLevel): string {
  const desc: Record<RiskLevel, string> = {
    low: "财务状况相对稳健",
    medium: "存在一定资金风险，需要保持关注",
    high: "资金缺口明显，建议尽快调整",
    critical: "财务风险极高，需要立即采取行动",
  };
  return desc[level];
}
