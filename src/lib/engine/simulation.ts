import { CalculatorFormState, CityCostProfile, YearlySimulationResult } from "@/lib/types";
import { calculateLivingLevel } from "./living-level";

export function simulateYearly(input: CalculatorFormState, city: CityCostProfile): YearlySimulationResult[] {
  const results: YearlySimulationResult[] = [];
  let balance = input.currentSavings || 0;
  let monthlySalary = input.incomeType === "with_salary" ? input.monthlySalaryIncome || 0 : 0;
  let monthlyPassive = input.monthlyPassiveIncome || 0;
  let monthlyExpense = input.monthlyExpense || 0;

  for (let age = input.currentAge; age <= input.maxAge; age++) {
    const yearIndex = age - input.currentAge;
    const startBalance = balance;
    const hasSalary =
      input.incomeType === "with_salary" &&
      monthlySalary > 0 &&
      (!input.salaryStopAge || age < input.salaryStopAge);

    const salaryIncome = hasSalary ? monthlySalary * 12 : 0;
    const passiveIncome = monthlyPassive * 12;
    const totalIncome = salaryIncome + passiveIncome;
    const expense = monthlyExpense * 12;
    const investmentReturn = Math.max(balance, 0) * input.annualReturnRate;
    const endBalance = balance + investmentReturn + totalIncome - expense;
    const livingLevel = calculateLivingLevel(monthlyExpense, city);

    results.push({
      age,
      yearIndex,
      startBalance,
      salaryIncome,
      passiveIncome,
      totalIncome,
      expense,
      investmentReturn,
      endBalance,
      monthlyExpense,
      livingLevel,
      isDepleted: endBalance < 0,
    });

    balance = endBalance;
    if (balance < 0) break;

    if (hasSalary && input.annualSalaryGrowthRate) {
      monthlySalary *= 1 + input.annualSalaryGrowthRate;
    }
    if (input.annualPassiveIncomeGrowthRate) {
      monthlyPassive *= 1 + input.annualPassiveIncomeGrowthRate;
    }
    if (input.annualInflationRate) {
      monthlyExpense *= 1 + input.annualInflationRate;
    }
  }

  return results;
}

export function calculateSustainableAge(input: CalculatorFormState, yearlyResults: YearlySimulationResult[]) {
  const depleted = yearlyResults.find((item) => item.isDepleted);
  if (depleted) {
    return {
      sustainableAge: depleted.age,
      depletionAge: depleted.age,
      yearsSustainable: depleted.age - input.currentAge,
    };
  }

  const last = yearlyResults[yearlyResults.length - 1];
  return {
    sustainableAge: last.age,
    depletionAge: undefined,
    yearsSustainable: last.age - input.currentAge,
  };
}

export function calculateMonthlySurplus(input: CalculatorFormState) {
  const salaryIncome = input.incomeType === "with_salary" ? input.monthlySalaryIncome : 0;
  return salaryIncome + input.monthlyPassiveIncome - input.monthlyExpense;
}

export function calculateSavingsRate(input: CalculatorFormState) {
  if (input.incomeType !== "with_salary" || input.monthlySalaryIncome <= 0) return undefined;
  return calculateMonthlySurplus(input) / input.monthlySalaryIncome;
}

export function simulateToTargetAge(input: CalculatorFormState, city: CityCostProfile, targetAge: number) {
  const results = simulateYearly({ ...input, maxAge: targetAge }, city);
  const last = results[results.length - 1];
  return {
    results,
    finalBalance: last?.endBalance ?? input.currentSavings,
    isSustainableToTarget: Boolean(last && last.age >= targetAge && last.endBalance >= 0),
  };
}

export function buildFundCurveData(yearlyResults: YearlySimulationResult[]) {
  return yearlyResults.map((item) => ({
    age: item.age,
    balance: Math.round(item.endBalance),
    income: item.totalIncome,
    expense: item.expense,
    investmentReturn: item.investmentReturn,
    livingLevel: item.livingLevel,
  }));
}
