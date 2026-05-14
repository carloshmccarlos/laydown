"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCalculatorStore } from "@/lib/store/calculatorStore";
import { CalculatorFormState } from "@/lib/types";
import { getCityByCode } from "@/lib/data/cities";
import { calculateResult } from "@/lib/engine/calculator";

const demoData: CalculatorFormState = {
  mode: "target_projection",
  incomeType: "with_salary",
  currentAge: 35,
  targetAge: 68,
  cityCode: "shanghai",
  monthlySalaryIncome: 18000,
  monthlyPassiveIncome: 0,
  monthlyExpense: 14550,
  currentSavings: 1280000,
  annualReturnRate: 0.035,
  annualSalaryGrowthRate: 0.03,
  annualPassiveIncomeGrowthRate: 0.03,
  annualInflationRate: 0.02,
  maxAge: 90,
  expenseInputMode: "total",
};

export default function DemoPage() {
  const router = useRouter();
  const setFormState = useCalculatorStore((s) => s.setFormState);
  const setResult = useCalculatorStore((s) => s.setResult);

  useEffect(() => {
    const city = getCityByCode(demoData.cityCode) || getCityByCode("shanghai")!;
    const result = calculateResult(demoData, city);
    setFormState(demoData);
    setResult(result);
    router.push("/result");
  }, [router, setFormState, setResult]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-pulse text-gray-400">正在加载示例数据...</div>
    </div>
  );
}
