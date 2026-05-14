import { CalculatorFormState, CalculatorResult, CityCostProfile } from "@/lib/types";
import {
  calculateMonthlySurplus,
  calculateSavingsRate,
  calculateSustainableAge,
  simulateToTargetAge,
  simulateYearly,
} from "./simulation";
import { calculateLivingLevel } from "./living-level";
import { calculateRiskLevel } from "./risk";
import { generateCurrentProjectionSuggestions, generateTargetProjectionSuggestions } from "./suggestions";

function buildSummaryText(input: CalculatorFormState, sustainability: ReturnType<typeof calculateSustainableAge>, monthlySurplus: number): string {
  const surplusText =
    monthlySurplus >= 0
      ? `每月结余 ${monthlySurplus.toLocaleString()} 元`
      : `每月缺口 ${Math.abs(monthlySurplus).toLocaleString()} 元`;

  if (input.mode === "current_projection") {
    return `按当前收支和通货膨胀假设，资金预计可维持到 ${sustainability.sustainableAge} 岁（约 ${sustainability.yearsSustainable} 年）。${surplusText}。`;
  }

  return `基于当前参数测算目标年龄，${surplusText}。`;
}

function buildTargetSummaryText(input: CalculatorFormState, isSustainable: boolean, finalBalance: number): string {
  if (!input.targetAge) return "";
  if (isSustainable) {
    return `按当前参数，你可以维持到目标年龄 ${input.targetAge} 岁，预计最终余额约 ${Math.round(finalBalance).toLocaleString()} 元。`;
  }
  return `按当前参数，资金在达到 ${input.targetAge} 岁时存在缺口，缺口约 ${Math.abs(Math.round(finalBalance)).toLocaleString()} 元。`;
}

export function calculateCurrentWithSalary(input: CalculatorFormState, city: CityCostProfile): CalculatorResult {
  const normalizedInput = { ...input, incomeType: "with_salary" as const };
  const yearlyResults = simulateYearly(normalizedInput, city);
  const sustainability = calculateSustainableAge(normalizedInput, yearlyResults);
  const currentLivingLevel = calculateLivingLevel(normalizedInput.monthlyExpense, city);
  const monthlySurplus = calculateMonthlySurplus(normalizedInput);
  const annualSurplus = monthlySurplus * 12;
  const savingsRate = calculateSavingsRate(normalizedInput);
  const risk = calculateRiskLevel(normalizedInput, yearlyResults);
  const suggestions = generateCurrentProjectionSuggestions(normalizedInput, city, yearlyResults);

  return {
    mode: "current_projection",
    incomeType: "with_salary",
    currentAge: normalizedInput.currentAge,
    sustainableAge: sustainability.sustainableAge,
    yearsSustainable: sustainability.yearsSustainable,
    depletionAge: sustainability.depletionAge,
    currentLivingLevel,
    monthlySurplus,
    annualSurplus,
    savingsRate,
    riskLevel: risk.riskLevel,
    riskReasons: risk.reasons,
    yearlyResults,
    suggestions,
    summaryText: buildSummaryText(normalizedInput, sustainability, monthlySurplus),
  };
}

export function calculateCurrentWithoutSalary(input: CalculatorFormState, city: CityCostProfile): CalculatorResult {
  const normalizedInput = { ...input, monthlySalaryIncome: 0, annualSalaryGrowthRate: 0, incomeType: "without_salary" as const };
  const yearlyResults = simulateYearly(normalizedInput, city);
  const sustainability = calculateSustainableAge(normalizedInput, yearlyResults);
  const currentLivingLevel = calculateLivingLevel(normalizedInput.monthlyExpense, city);
  const monthlySurplus = calculateMonthlySurplus(normalizedInput);
  const annualSurplus = monthlySurplus * 12;
  const risk = calculateRiskLevel(normalizedInput, yearlyResults);
  const suggestions = generateCurrentProjectionSuggestions(normalizedInput, city, yearlyResults);

  return {
    mode: "current_projection",
    incomeType: "without_salary",
    currentAge: normalizedInput.currentAge,
    sustainableAge: sustainability.sustainableAge,
    yearsSustainable: sustainability.yearsSustainable,
    depletionAge: sustainability.depletionAge,
    currentLivingLevel,
    monthlySurplus,
    annualSurplus,
    savingsRate: undefined,
    riskLevel: risk.riskLevel,
    riskReasons: risk.reasons,
    yearlyResults,
    suggestions,
    summaryText: buildSummaryText(normalizedInput, sustainability, monthlySurplus),
  };
}

export function calculateTargetWithSalary(input: CalculatorFormState, city: CityCostProfile): CalculatorResult {
  if (!input.targetAge) throw new Error("目标年龄不能为空");
  const targetAge = input.targetAge;

  const normalizedInput = { ...input, incomeType: "with_salary" as const };
  const { results, finalBalance, isSustainableToTarget } = simulateToTargetAge(normalizedInput, city, targetAge);
  const sustainability = calculateSustainableAge(normalizedInput, results);
  const fundingGap = finalBalance < 0 ? Math.abs(finalBalance) : 0;
  const currentLivingLevel = calculateLivingLevel(normalizedInput.monthlyExpense, city);
  const monthlySurplus = calculateMonthlySurplus(normalizedInput);
  const annualSurplus = monthlySurplus * 12;
  const savingsRate = calculateSavingsRate(normalizedInput);
  const risk = calculateRiskLevel(normalizedInput, results);
  const suggestions = generateTargetProjectionSuggestions(normalizedInput, city, targetAge, isSustainableToTarget);

  return {
    mode: "target_projection",
    incomeType: "with_salary",
    currentAge: normalizedInput.currentAge,
    targetAge,
    sustainableAge: sustainability.sustainableAge,
    yearsSustainable: sustainability.yearsSustainable,
    depletionAge: sustainability.depletionAge,
    isSustainableToTarget,
    finalBalance,
    fundingGap,
    currentLivingLevel,
    monthlySurplus,
    annualSurplus,
    savingsRate,
    riskLevel: risk.riskLevel,
    riskReasons: risk.reasons,
    yearlyResults: results,
    suggestions,
    summaryText: buildTargetSummaryText(normalizedInput, isSustainableToTarget, finalBalance),
  };
}

export function calculateTargetWithoutSalary(input: CalculatorFormState, city: CityCostProfile): CalculatorResult {
  if (!input.targetAge) throw new Error("目标年龄不能为空");
  const targetAge = input.targetAge;

  const normalizedInput = { ...input, incomeType: "without_salary" as const, monthlySalaryIncome: 0, annualSalaryGrowthRate: 0 };
  const { results, finalBalance, isSustainableToTarget } = simulateToTargetAge(normalizedInput, city, targetAge);
  const sustainability = calculateSustainableAge(normalizedInput, results);
  const fundingGap = finalBalance < 0 ? Math.abs(finalBalance) : 0;
  const currentLivingLevel = calculateLivingLevel(normalizedInput.monthlyExpense, city);
  const monthlySurplus = calculateMonthlySurplus(normalizedInput);
  const annualSurplus = monthlySurplus * 12;
  const risk = calculateRiskLevel(normalizedInput, results);
  const suggestions = generateTargetProjectionSuggestions(normalizedInput, city, targetAge, isSustainableToTarget);

  return {
    mode: "target_projection",
    incomeType: "without_salary",
    currentAge: normalizedInput.currentAge,
    targetAge,
    sustainableAge: sustainability.sustainableAge,
    yearsSustainable: sustainability.yearsSustainable,
    depletionAge: sustainability.depletionAge,
    isSustainableToTarget,
    finalBalance,
    fundingGap,
    currentLivingLevel,
    monthlySurplus,
    annualSurplus,
    savingsRate: undefined,
    riskLevel: risk.riskLevel,
    riskReasons: risk.reasons,
    yearlyResults: results,
    suggestions,
    summaryText: buildTargetSummaryText(normalizedInput, isSustainableToTarget, finalBalance),
  };
}

export function calculateResult(input: CalculatorFormState, city: CityCostProfile): CalculatorResult {
  if (input.mode === "current_projection" && input.incomeType === "with_salary") {
    return calculateCurrentWithSalary(input, city);
  }
  if (input.mode === "current_projection" && input.incomeType === "without_salary") {
    return calculateCurrentWithoutSalary(input, city);
  }
  if (input.mode === "target_projection" && input.incomeType === "with_salary") {
    return calculateTargetWithSalary(input, city);
  }
  if (input.mode === "target_projection" && input.incomeType === "without_salary") {
    return calculateTargetWithoutSalary(input, city);
  }
  throw new Error("不支持的计算模式");
}
