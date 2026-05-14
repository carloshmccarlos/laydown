import { AdjustmentSuggestion, CalculatorFormState, CityCostProfile, LivingLevel } from "@/lib/types";
import { calculateMonthlySurplus, calculateSustainableAge, simulateToTargetAge, simulateYearly } from "./simulation";
import { getMonthlyCostByLivingLevel } from "./living-level";

function binarySearchMinimum(
  min: number,
  max: number,
  checker: (value: number) => boolean,
  precision = 1
): number {
  let left = min;
  let right = max;
  let answer = max;

  while (right - left > precision) {
    const mid = Math.floor((left + right) / 2);
    if (checker(mid)) {
      answer = mid;
      right = mid;
    } else {
      left = mid;
    }
  }

  return answer;
}

export function findRequiredMonthlyIncomeIncrease(
  input: CalculatorFormState,
  city: CityCostProfile,
  targetAge: number
): number {
  return binarySearchMinimum(0, 1_000_000, (increase) => {
    const testInput = { ...input, monthlySalaryIncome: input.monthlySalaryIncome + increase };
    return simulateToTargetAge(testInput, city, targetAge).isSustainableToTarget;
  });
}

export function findRequiredMonthlyExpenseReduction(
  input: CalculatorFormState,
  city: CityCostProfile,
  targetAge: number
): number {
  return binarySearchMinimum(0, input.monthlyExpense, (reduction) => {
    const testInput = { ...input, monthlyExpense: input.monthlyExpense - reduction };
    return simulateToTargetAge(testInput, city, targetAge).isSustainableToTarget;
  });
}

export function findRequiredAdditionalSavings(
  input: CalculatorFormState,
  city: CityCostProfile,
  targetAge: number
): number {
  return binarySearchMinimum(
    0,
    100_000_000,
    (additional) => {
      const testInput = { ...input, currentSavings: input.currentSavings + additional };
      return simulateToTargetAge(testInput, city, targetAge).isSustainableToTarget;
    },
    10
  );
}

export function findRequiredPassiveIncomeIncrease(
  input: CalculatorFormState,
  city: CityCostProfile,
  targetAge: number
): number {
  return binarySearchMinimum(0, input.monthlyExpense, (increase) => {
    const testInput = { ...input, monthlyPassiveIncome: input.monthlyPassiveIncome + increase };
    return simulateToTargetAge(testInput, city, targetAge).isSustainableToTarget;
  });
}

export function findSustainableLivingLevelForTarget(
  input: CalculatorFormState,
  city: CityCostProfile,
  targetAge: number
): LivingLevel {
  const levels: LivingLevel[] = ["L5", "L4", "L3", "L2", "L1"];
  for (const level of levels) {
    const monthlyExpense = getMonthlyCostByLivingLevel(level, city);
    const testInput = { ...input, monthlyExpense };
    if (simulateToTargetAge(testInput, city, targetAge).isSustainableToTarget) return level;
  }
  return "L1";
}

export function generateCombinedPlan(input: CalculatorFormState): AdjustmentSuggestion {
  const incomeIncrease = input.incomeType === "with_salary" ? Math.round(input.monthlySalaryIncome * 0.1) : 0;
  const expenseReduction = Math.round(input.monthlyExpense * 0.1);
  const passiveIncomeIncrease = input.incomeType === "without_salary" ? Math.round(input.monthlyExpense * 0.1) : 0;

  return {
    type: "combined_plan",
    title: "组合调整方案",
    description:
      input.incomeType === "with_salary"
        ? `可以先尝试每月增加收入约 ${incomeIncrease.toLocaleString()} 元，同时减少支出约 ${expenseReduction.toLocaleString()} 元，再观察资金曲线变化。`
        : `可以先尝试每月减少支出约 ${expenseReduction.toLocaleString()} 元，同时增加被动收入约 ${passiveIncomeIncrease.toLocaleString()} 元。`,
    monthlyIncomeIncrease: incomeIncrease || undefined,
    monthlyExpenseReduction: expenseReduction || undefined,
    passiveIncomeIncrease: passiveIncomeIncrease || undefined,
    priority: 6,
    difficulty: "medium",
  };
}

export function generateTargetProjectionSuggestions(
  input: CalculatorFormState,
  city: CityCostProfile,
  targetAge: number,
  isSustainableToTarget: boolean
): AdjustmentSuggestion[] {
  const suggestions: AdjustmentSuggestion[] = [];

  if (isSustainableToTarget) {
    suggestions.push({
      type: "combined_plan",
      title: "当前方案可达",
      description: `按当前参数可以维持到 ${targetAge} 岁，建议保留安全垫并定期更新支出、收益率和通货膨胀率。`,
      priority: 1,
      difficulty: "easy",
    });
    return suggestions;
  }

  if (input.incomeType === "with_salary") {
    const incomeIncrease = findRequiredMonthlyIncomeIncrease(input, city, targetAge);
    suggestions.push({
      type: "increase_income",
      title: "增加收入",
      description: `每月主动收入增加约 ${incomeIncrease.toLocaleString()} 元，可以帮助维持到 ${targetAge} 岁。`,
      monthlyIncomeIncrease: incomeIncrease,
      priority: 2,
      difficulty: incomeIncrease <= input.monthlySalaryIncome * 0.2 ? "medium" : "hard",
    });
  }

  const expenseReduction = findRequiredMonthlyExpenseReduction(input, city, targetAge);
  suggestions.push({
    type: "reduce_expense",
    title: "减少支出",
    description: `每月支出减少约 ${expenseReduction.toLocaleString()} 元，可以帮助维持到 ${targetAge} 岁。`,
    monthlyExpenseReduction: expenseReduction,
    priority: 1,
    difficulty: expenseReduction <= input.monthlyExpense * 0.15 ? "medium" : "hard",
  });

  const additionalSavings = findRequiredAdditionalSavings(input, city, targetAge);
  suggestions.push({
    type: "add_savings",
    title: "补充本金",
    description: `一次性补充约 ${additionalSavings.toLocaleString()} 元本金，可以帮助维持到 ${targetAge} 岁。`,
    additionalSavingsRequired: additionalSavings,
    priority: 3,
    difficulty: "hard",
  });

  const passiveIncomeIncrease = findRequiredPassiveIncomeIncrease(input, city, targetAge);
  suggestions.push({
    type: "increase_passive_income",
    title: "增加被动收入",
    description: `每月增加约 ${passiveIncomeIncrease.toLocaleString()} 元被动收入，可以帮助维持到 ${targetAge} 岁。`,
    passiveIncomeIncrease,
    priority: 4,
    difficulty: "hard",
  });

  const sustainableLevel = findSustainableLivingLevelForTarget(input, city, targetAge);
  suggestions.push({
    type: "lower_living_level",
    title: "调整生活等级",
    description: `按当前资产和收入，更稳妥的生活等级约为 ${sustainableLevel}。`,
    recommendedLivingLevel: sustainableLevel,
    priority: 5,
    difficulty: "medium",
  });

  suggestions.push(generateCombinedPlan(input));
  return suggestions.sort((a, b) => a.priority - b.priority);
}

export function generateCurrentProjectionSuggestions(
  input: CalculatorFormState,
  city: CityCostProfile,
  yearlyResults: ReturnType<typeof simulateYearly>
): AdjustmentSuggestion[] {
  const suggestions: AdjustmentSuggestion[] = [];
  const monthlySurplus = calculateMonthlySurplus(input);
  const sustainable = calculateSustainableAge(input, yearlyResults);
  const depletionAge = sustainable.depletionAge;

  if (monthlySurplus >= 0 && !depletionAge) {
    suggestions.push({
      type: "combined_plan",
      title: "当前状态较稳",
      description: "当前每月有结余，且资金可维持到模拟结束。建议继续保留安全垫并定期复测。",
      priority: 1,
      difficulty: "easy",
    });
    return suggestions;
  }

  if (monthlySurplus < 0) {
    suggestions.push({
      type: "reduce_expense",
      title: "控制支出",
      description: `当前每月现金流为负，缺口约 ${Math.abs(monthlySurplus).toLocaleString()} 元，建议优先压缩非必要支出。`,
      monthlyExpenseReduction: Math.abs(monthlySurplus),
      priority: 1,
      difficulty: "medium",
    });
  }

  if (input.incomeType === "with_salary" && input.monthlySalaryIncome > 0) {
    suggestions.push({
      type: "increase_income",
      title: "增加收入",
      description: "通过提升技能、副业或跳槽增加主动收入，可以延长资金可持续时间。",
      priority: 2,
      difficulty: "medium",
    });
  }

  suggestions.push({
    type: "increase_passive_income",
    title: "增加被动收入",
    description: "发展稳健的被动收入来源，提升抵抗通胀和现金流波动的能力。",
    priority: 3,
    difficulty: "hard",
  });

  suggestions.push({
    type: "lower_living_level",
    title: "调整生活等级",
    description: "适当降低当前生活等级，可以有效延长资金可持续时间。",
    priority: 4,
    difficulty: "medium",
  });

  suggestions.push({
    type: "combined_plan",
    title: "综合优化",
    description: "同时从增加收入、减少支出、增加被动收入三方面入手，效果更稳。",
    priority: 5,
    difficulty: "medium",
  });

  return suggestions;
}
