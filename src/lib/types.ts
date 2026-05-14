export type CalculatorMode = "current_projection" | "target_projection";

export type IncomeType = "with_salary" | "without_salary";

export type LivingLevel = "L1" | "L2" | "L3" | "L4" | "L5";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type CityTier = "一线" | "新一线" | "二线" | "三线" | "四线及以下";

export type ExpenseInputMode = "total" | "breakdown";

export type ExpenseBreakdown = {
  rentOrMortgage: number;
  food: number;
  transport: number;
  communication: number;
  clothing: number;
  medical: number;
  insurance: number;
  entertainmentEducation: number;
  familySupport: number;
  other: number;
};

export type CityCostProfile = {
  cityCode: string;
  cityName: string;
  province: string;
  tier: CityTier;
  baseMonthlyCost: number;
  rentIndex: number;
  foodIndex: number;
  transportIndex: number;
  entertainmentIndex: number;
  expenseBreakdown: ExpenseBreakdown;
};

export type CalculatorFormState = {
  mode: CalculatorMode;
  incomeType: IncomeType;
  currentAge: number;
  targetAge?: number;
  cityCode: string;
  monthlySalaryIncome: number;
  monthlyPassiveIncome: number;
  monthlyExpense: number;
  currentSavings: number;
  annualReturnRate: number;
  annualSalaryGrowthRate: number;
  annualPassiveIncomeGrowthRate: number;
  annualInflationRate: number;
  salaryStopAge?: number;
  maxAge: number;
  expenseInputMode?: ExpenseInputMode;
  expenseBreakdown?: ExpenseBreakdown;
};

export type YearlySimulationResult = {
  age: number;
  yearIndex: number;
  startBalance: number;
  salaryIncome: number;
  passiveIncome: number;
  totalIncome: number;
  expense: number;
  investmentReturn: number;
  endBalance: number;
  monthlyExpense: number;
  livingLevel: LivingLevel;
  isDepleted: boolean;
};

export type CalculatorResult = {
  mode: CalculatorMode;
  incomeType: IncomeType;
  currentAge: number;
  targetAge?: number;
  sustainableAge: number;
  yearsSustainable: number;
  depletionAge?: number;
  isSustainableToTarget?: boolean;
  finalBalance?: number;
  fundingGap?: number;
  currentLivingLevel: LivingLevel;
  monthlySurplus: number;
  annualSurplus: number;
  savingsRate?: number;
  riskLevel: RiskLevel;
  riskReasons: string[];
  yearlyResults: YearlySimulationResult[];
  suggestions: AdjustmentSuggestion[];
  summaryText: string;
};

export type AdjustmentSuggestionType =
  | "increase_income"
  | "reduce_expense"
  | "add_savings"
  | "increase_passive_income"
  | "lower_living_level"
  | "combined_plan";

export type AdjustmentSuggestion = {
  type: AdjustmentSuggestionType;
  title: string;
  description: string;
  monthlyIncomeIncrease?: number;
  monthlyExpenseReduction?: number;
  additionalSavingsRequired?: number;
  passiveIncomeIncrease?: number;
  recommendedLivingLevel?: LivingLevel;
  projectedSustainableAge?: number;
  projectedFinalBalance?: number;
  priority: number;
  difficulty: "easy" | "medium" | "hard";
};

export type SavedPlan = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  formState: CalculatorFormState;
  result: CalculatorResult;
  tags?: string[];
  note?: string;
};

export type PlanComparisonItem = {
  planId: string;
  planName: string;
  sustainableAge: number;
  targetAge?: number;
  isSustainableToTarget?: boolean;
  currentLivingLevel: LivingLevel;
  monthlySalaryIncome: number;
  monthlyPassiveIncome: number;
  monthlyExpense: number;
  currentSavings: number;
  annualReturnRate: number;
  finalBalance?: number;
  fundingGap?: number;
  riskLevel: RiskLevel;
};

export type ScenarioSimulatorState = CalculatorFormState & {
  basePlanId?: string;
  isDirty: boolean;
};

export type FundCurvePoint = {
  age: number;
  balance: number;
  income: number;
  expense: number;
  investmentReturn: number;
  livingLevel: LivingLevel;
};
