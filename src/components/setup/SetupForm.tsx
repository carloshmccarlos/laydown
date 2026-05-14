"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Briefcase,
  Calculator,
  Check,
  Home,
  Info,
  LineChart,
  RotateCcw,
  Settings,
  Target,
} from "lucide-react";
import { CalculatorFormState, CalculatorMode, ExpenseBreakdown, ExpenseInputMode, IncomeType } from "@/lib/types";
import { CITIES, getCityByCode, sumExpenseBreakdown } from "@/lib/data/cities";
import { calculateResult } from "@/lib/engine/calculator";
import { calculateLivingLevel, LIVING_LEVELS } from "@/lib/engine/living-level";
import { useCalculatorStore } from "@/lib/store/calculatorStore";
import { cn } from "@/lib/utils";

const finiteNumber = (fallback: number, schema: z.ZodNumber = z.number()) =>
  z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return fallback;
    if (typeof value === "number" && Number.isNaN(value)) return fallback;
    return value;
  }, schema);

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "number" && Number.isNaN(value)) return undefined;
  return value;
}, z.number().optional());

const expenseBreakdownSchema = z.object({
  rentOrMortgage: finiteNumber(0, z.number().min(0)),
  food: finiteNumber(0, z.number().min(0)),
  transport: finiteNumber(0, z.number().min(0)),
  communication: finiteNumber(0, z.number().min(0)),
  clothing: finiteNumber(0, z.number().min(0)),
  medical: finiteNumber(0, z.number().min(0)),
  insurance: finiteNumber(0, z.number().min(0)),
  entertainmentEducation: finiteNumber(0, z.number().min(0)),
  familySupport: finiteNumber(0, z.number().min(0)),
  other: finiteNumber(0, z.number().min(0)),
});

const calculatorSchema = z
  .object({
    mode: z.enum(["current_projection", "target_projection"]),
    incomeType: z.enum(["with_salary", "without_salary"]),
    currentAge: finiteNumber(30, z.number().min(16, "当前年龄不能小于 16 岁").max(100, "当前年龄不能超过 100 岁")),
    targetAge: optionalNumber,
    cityCode: z.string().min(1),
    monthlySalaryIncome: finiteNumber(0, z.number().min(0)),
    monthlyPassiveIncome: finiteNumber(0, z.number().min(0)),
    monthlyExpense: finiteNumber(0, z.number().positive("月支出必须大于 0")),
    currentSavings: finiteNumber(0, z.number().min(0)),
    annualReturnRate: finiteNumber(0.035, z.number().min(-0.1).max(0.15)),
    annualSalaryGrowthRate: finiteNumber(0.03, z.number().min(-0.2).max(0.2)),
    annualPassiveIncomeGrowthRate: finiteNumber(0.03, z.number().min(-0.2).max(0.2)),
    annualInflationRate: finiteNumber(0.02, z.number().min(0).max(0.1)),
    salaryStopAge: optionalNumber,
    maxAge: finiteNumber(90, z.number().min(60).max(120)),
    expenseInputMode: z.enum(["total", "breakdown"]).default("total"),
    expenseBreakdown: expenseBreakdownSchema,
  })
  .superRefine((data, ctx) => {
    if (data.mode === "target_projection") {
      if (!data.targetAge) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["targetAge"], message: "目标年龄不能为空" });
      } else if (data.targetAge <= data.currentAge) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["targetAge"], message: "目标年龄需要大于当前年龄" });
      }
    }

    if (data.incomeType === "with_salary" && data.monthlySalaryIncome <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["monthlySalaryIncome"], message: "有薪资收入时，请填写月收入" });
    }

    if (data.incomeType === "without_salary" && data.currentSavings <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["currentSavings"], message: "无薪资收入时，请填写当前存款" });
    }

    if (data.incomeType === "with_salary" && data.salaryStopAge !== undefined) {
      if (data.salaryStopAge <= data.currentAge) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["salaryStopAge"], message: "停止工作年龄必须大于当前年龄" });
      }
      if (data.salaryStopAge > data.maxAge) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["salaryStopAge"], message: "停止工作年龄不能超过最大模拟年龄" });
      }
    }
  });

type FormData = z.infer<typeof calculatorSchema>;

const defaultCity = getCityByCode("shanghai") || CITIES[0];

const defaultValues: FormData = {
  mode: "current_projection",
  incomeType: "with_salary",
  currentAge: 30,
  cityCode: defaultCity.cityCode,
  monthlySalaryIncome: 18000,
  monthlyPassiveIncome: 0,
  monthlyExpense: defaultCity.baseMonthlyCost,
  currentSavings: 1280000,
  annualReturnRate: 0.035,
  annualSalaryGrowthRate: 0.03,
  annualPassiveIncomeGrowthRate: 0.03,
  annualInflationRate: 0.02,
  maxAge: 90,
  expenseInputMode: "total",
  expenseBreakdown: defaultCity.expenseBreakdown,
};

const expenseItems: Array<{ key: keyof ExpenseBreakdown; label: string }> = [
  { key: "rentOrMortgage", label: "居住" },
  { key: "food", label: "餐饮" },
  { key: "transport", label: "交通" },
  { key: "communication", label: "通信" },
  { key: "clothing", label: "衣服" },
  { key: "medical", label: "医疗" },
  { key: "insurance", label: "保险" },
  { key: "entertainmentEducation", label: "娱乐教育" },
  { key: "familySupport", label: "家庭支持" },
  { key: "other", label: "其他" },
];

const returnRateOptions = [
  { label: "2% 保守", value: 0.02 },
  { label: "4% 稳健", value: 0.04 },
  { label: "6% 积极", value: 0.06 },
];

export default function SetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setFormState = useCalculatorStore((s) => s.setFormState);
  const setResult = useCalculatorStore((s) => s.setResult);
  const [step, setStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lastSalaryIncome, setLastSalaryIncome] = useState(defaultValues.monthlySalaryIncome);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      ...defaultValues,
      mode: (searchParams.get("mode") as CalculatorMode) || "current_projection",
    },
  });

  const mode = watch("mode");
  const incomeType = watch("incomeType");
  const cityCode = watch("cityCode");
  const currentAge = watch("currentAge");
  const targetAge = watch("targetAge");
  const monthlySalaryIncome = watch("monthlySalaryIncome");
  const monthlyPassiveIncome = watch("monthlyPassiveIncome");
  const monthlyExpense = watch("monthlyExpense");
  const annualReturnRate = watch("annualReturnRate");
  const annualSalaryGrowthRate = watch("annualSalaryGrowthRate");
  const annualPassiveIncomeGrowthRate = watch("annualPassiveIncomeGrowthRate");
  const annualInflationRate = watch("annualInflationRate");
  const salaryStopAge = watch("salaryStopAge");
  const maxAge = watch("maxAge");
  const expenseInputMode = watch("expenseInputMode");
  const expenseBreakdown = watch("expenseBreakdown");

  const city = useMemo(() => getCityByCode(cityCode) || defaultCity, [cityCode]);
  const currentLivingLevel = useMemo(() => calculateLivingLevel(monthlyExpense || 0, city), [monthlyExpense, city]);
  const monthlySurplus = (incomeType === "with_salary" ? monthlySalaryIncome || 0 : 0) + (monthlyPassiveIncome || 0) - (monthlyExpense || 0);

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "current_projection" || urlMode === "target_projection") {
      setValue("mode", urlMode);
    }
  }, [searchParams, setValue]);

  const onSubmit = (data: FormData) => {
    const normalizedBreakdown = data.expenseBreakdown || city.expenseBreakdown;
    const normalizedExpense =
      data.expenseInputMode === "breakdown" ? sumExpenseBreakdown(normalizedBreakdown) : data.monthlyExpense;
    const formState: CalculatorFormState = {
      ...data,
      targetAge: data.mode === "target_projection" ? data.targetAge : undefined,
      monthlySalaryIncome: data.incomeType === "with_salary" ? data.monthlySalaryIncome : 0,
      annualSalaryGrowthRate: data.incomeType === "with_salary" ? data.annualSalaryGrowthRate : 0,
      salaryStopAge: data.incomeType === "with_salary" ? data.salaryStopAge : undefined,
      monthlyExpense: normalizedExpense,
      expenseBreakdown: normalizedBreakdown,
    };
    const result = calculateResult(formState, city);
    setFormState(formState);
    setResult(result);
    router.push("/result");
  };

  const handleModeSelect = (nextMode: CalculatorMode) => {
    setValue("mode", nextMode, { shouldValidate: true });
    if (nextMode === "target_projection") {
      setValue("targetAge", targetAge || 60, { shouldValidate: true });
    }
    setStep(2);
  };

  const handleIncomeSelect = (nextIncomeType: IncomeType) => {
    if (nextIncomeType === "without_salary") {
      if (monthlySalaryIncome > 0) setLastSalaryIncome(monthlySalaryIncome);
      setValue("monthlySalaryIncome", 0, { shouldValidate: true });
      setValue("annualSalaryGrowthRate", 0, { shouldValidate: true });
      setValue("salaryStopAge", undefined, { shouldValidate: true });
    } else {
      setValue("monthlySalaryIncome", lastSalaryIncome || defaultValues.monthlySalaryIncome, { shouldValidate: true });
      setValue("annualSalaryGrowthRate", defaultValues.annualSalaryGrowthRate, { shouldValidate: true });
    }
    setValue("incomeType", nextIncomeType, { shouldValidate: true });
    setStep(3);
  };

  const handleCityChange = (code: string) => {
    const nextCity = getCityByCode(code) || defaultCity;
    setValue("cityCode", nextCity.cityCode, { shouldValidate: true });
    setValue("expenseBreakdown", nextCity.expenseBreakdown, { shouldValidate: true });
    setValue("monthlyExpense", nextCity.baseMonthlyCost, { shouldValidate: true });
  };

  const handleExpenseModeChange = (nextMode: ExpenseInputMode) => {
    setValue("expenseInputMode", nextMode, { shouldValidate: true });
    if (nextMode === "breakdown") {
      const nextBreakdown = expenseBreakdown || city.expenseBreakdown;
      setValue("expenseBreakdown", nextBreakdown, { shouldValidate: true });
      setValue("monthlyExpense", sumExpenseBreakdown(nextBreakdown), { shouldValidate: true });
    }
  };

  const updateExpenseItem = (key: keyof ExpenseBreakdown, value: number) => {
    const next = {
      ...(expenseBreakdown || city.expenseBreakdown),
      [key]: Number.isFinite(value) ? Math.max(0, value) : 0,
    };
    setValue("expenseBreakdown", next, { shouldValidate: true });
    setValue("monthlyExpense", sumExpenseBreakdown(next), { shouldValidate: true });
  };

  const updatePercentField = (
    field: "annualSalaryGrowthRate" | "annualPassiveIncomeGrowthRate" | "annualInflationRate",
    rawValue: string
  ) => {
    if (rawValue.trim() === "") {
      const fallback =
        field === "annualInflationRate"
          ? defaultValues.annualInflationRate
          : field === "annualPassiveIncomeGrowthRate"
          ? defaultValues.annualPassiveIncomeGrowthRate
          : defaultValues.annualSalaryGrowthRate;
      setValue(field, fallback, { shouldValidate: true });
      return;
    }
    const parsed = Number(rawValue);
    setValue(field, Number.isFinite(parsed) ? parsed / 100 : 0, { shouldValidate: true });
  };

  const resetForm = () => {
    reset(defaultValues);
    setLastSalaryIncome(defaultValues.monthlySalaryIncome);
    setShowAdvanced(false);
    setStep(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-950 mb-3 tracking-tight">开始测算</h1>
          <p className="text-slate-600">选择测算目标，再填写收入、支出、存款等信息</p>
        </div>
        <div className="hidden lg:flex items-start gap-4 pt-2">
          {[
            { num: 1, label: "选择模式" },
            { num: 2, label: "收入类型" },
            { num: 3, label: "填写信息" },
            { num: 4, label: "查看结果" },
          ].map((item, index) => (
            <div key={item.num} className="flex items-start gap-4">
              <div className="text-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mx-auto",
                    step >= item.num ? "bg-primary-600 text-white" : "bg-white border border-blue-200 text-slate-500"
                  )}
                >
                  {item.num}
                </div>
                <div className={cn("text-xs mt-2", step >= item.num ? "text-gray-950 font-medium" : "text-slate-500")}>
                  {item.label}
                </div>
              </div>
              {index < 3 && <div className={cn("w-24 h-0.5 mt-5", step > item.num ? "bg-primary-600" : "bg-blue-100")} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-xl border border-blue-100 p-5">
              <h2 className="text-xl font-bold text-gray-950 mb-4">1. 选择测算模式</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  data-testid="mode-current"
                  onClick={() => handleModeSelect("current_projection")}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-colors",
                    mode === "current_projection" ? "border-primary-500 bg-primary-50" : "border-blue-100 hover:border-blue-200"
                  )}
                >
                  <Calculator className="w-8 h-8 text-blue-600 shrink-0" />
                  <span>
                    <span className="block font-bold text-gray-950 text-lg">按现状推算</span>
                    <span className="block text-sm text-slate-600 mt-1">我现在这样能维持到几岁</span>
                  </span>
                  {mode === "current_projection" && <Check className="w-5 h-5 text-primary-600 ml-auto shrink-0" />}
                </button>

                <button
                  type="button"
                  data-testid="mode-target"
                  onClick={() => handleModeSelect("target_projection")}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-colors",
                    mode === "target_projection" ? "border-primary-500 bg-primary-50" : "border-blue-100 hover:border-blue-200"
                  )}
                >
                  <Target className="w-8 h-8 text-green-600 shrink-0" />
                  <span>
                    <span className="block font-bold text-gray-950 text-lg">按目标推算</span>
                    <span className="block text-sm text-slate-600 mt-1">我想维持到目标年龄</span>
                  </span>
                  {mode === "target_projection" && <Check className="w-5 h-5 text-primary-600 ml-auto shrink-0" />}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-blue-100 p-5">
              <h2 className="text-xl font-bold text-gray-950 mb-4">2. 选择收入类型</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  data-testid="income-with-salary"
                  onClick={() => handleIncomeSelect("with_salary")}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-colors",
                    incomeType === "with_salary" ? "border-primary-500 bg-primary-50" : "border-blue-100 hover:border-blue-200"
                  )}
                >
                  <Briefcase className="w-8 h-8 text-blue-600 shrink-0" />
                  <span>
                    <span className="block font-bold text-gray-950 text-lg">有薪资收入</span>
                    <span className="block text-sm text-slate-600 mt-1">工资、自由职业、副业等主动收入</span>
                  </span>
                  {incomeType === "with_salary" && <Check className="w-5 h-5 text-primary-600 ml-auto shrink-0" />}
                </button>

                <button
                  type="button"
                  data-testid="income-without-salary"
                  onClick={() => handleIncomeSelect("without_salary")}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-colors",
                    incomeType === "without_salary" ? "border-primary-500 bg-primary-50" : "border-blue-100 hover:border-blue-200"
                  )}
                >
                  <Home className="w-8 h-8 text-green-600 shrink-0" />
                  <span>
                    <span className="block font-bold text-gray-950 text-lg">无薪资收入</span>
                    <span className="block text-sm text-slate-600 mt-1">依靠存款、利息、租金或其他被动收入</span>
                  </span>
                  {incomeType === "without_salary" && <Check className="w-5 h-5 text-primary-600 ml-auto shrink-0" />}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-blue-100 p-5 space-y-6">
              <h2 className="text-xl font-bold text-gray-950">3. 填写基础信息</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">当前年龄</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={currentAge || ""}
                      onChange={(event) => setValue("currentAge", Number(event.target.value), { shouldValidate: true })}
                      className="w-full px-3 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <span className="absolute right-3 top-2 text-sm text-gray-400">岁</span>
                  </div>
                  {errors.currentAge && <p className="text-sm text-red-600 mt-1">{errors.currentAge.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">所在城市</label>
                  <select
                    data-testid="city-select"
                    value={cityCode}
                    onChange={(event) => handleCityChange(event.target.value)}
                    className="w-full px-3 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {CITIES.map((item) => (
                      <option key={item.cityCode} value={item.cityCode}>
                        {item.cityName} ({item.tier})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {mode === "target_projection" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">目标年龄</label>
                    <div className="relative">
                      <input
                        type="number"
                        data-testid="target-age-input"
                        value={targetAge || ""}
                        onChange={(event) => setValue("targetAge", Number(event.target.value), { shouldValidate: true })}
                        className="w-full px-3 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-400">岁</span>
                    </div>
                    {errors.targetAge && <p className="text-sm text-red-600 mt-1">{errors.targetAge.message}</p>}
                  </div>
                </div>
              )}

              {incomeType === "with_salary" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">月收入（税后）</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm text-gray-400">¥</span>
                    <input
                      type="number"
                      data-testid="salary-income-input"
                      value={monthlySalaryIncome || ""}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setValue("monthlySalaryIncome", value, { shouldValidate: true });
                        if (value > 0) setLastSalaryIncome(value);
                      }}
                      className="w-full pl-8 pr-3 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  {errors.monthlySalaryIncome && <p className="text-sm text-red-600 mt-1">{errors.monthlySalaryIncome.message}</p>}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-gray-700">月支出</label>
                  <div className="inline-flex rounded-lg border border-blue-100 bg-white p-1">
                    {[
                      { value: "total", label: "总额" },
                      { value: "breakdown", label: "详细输入" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleExpenseModeChange(item.value as ExpenseInputMode)}
                        data-testid={`expense-mode-${item.value}`}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded-md",
                          expenseInputMode === item.value ? "bg-primary-600 text-white" : "text-slate-600 hover:bg-blue-50"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {expenseInputMode === "total" ? (
                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-sm text-gray-400">¥</span>
                      <input
                        type="number"
                        data-testid="monthly-expense-input"
                        value={monthlyExpense || ""}
                        onChange={(event) => setValue("monthlyExpense", Number(event.target.value), { shouldValidate: true })}
                        className="w-full pl-8 pr-3 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    {errors.monthlyExpense && <p className="text-sm text-red-600 mt-1">{errors.monthlyExpense.message}</p>}
                  </div>
                ) : (
                  <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {expenseItems.map((item) => (
                        <label key={item.key} className="block">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-2 text-sm text-gray-400">¥</span>
                            <input
                              type="number"
                              data-testid={`expense-item-${item.key}`}
                              min={0}
                              value={(expenseBreakdown || city.expenseBreakdown)[item.key] || ""}
                              onChange={(event) => updateExpenseItem(item.key, Number(event.target.value))}
                              className="w-full pl-8 pr-3 py-2 border border-blue-100 rounded-lg bg-white"
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-blue-100 pt-3 text-sm">
                      <span className="font-medium text-gray-700">合计月支出</span>
                      <span className="font-bold text-primary-700">¥{monthlyExpense.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">被动收入</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm text-gray-400">¥</span>
                    <input
                      type="number"
                      data-testid="passive-income-input"
                      value={monthlyPassiveIncome || ""}
                      onChange={(event) => setValue("monthlyPassiveIncome", Number(event.target.value), { shouldValidate: true })}
                      className="w-full pl-8 pr-3 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">当前存款</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm text-gray-400">¥</span>
                    <input
                      type="number"
                      data-testid="current-savings-input"
                      value={watch("currentSavings") || ""}
                      onChange={(event) => setValue("currentSavings", Number(event.target.value), { shouldValidate: true })}
                      className="w-full pl-8 pr-3 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  {errors.currentSavings && <p className="text-sm text-red-600 mt-1">{errors.currentSavings.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  年化收益率
                  <Info className="inline w-3 h-3 text-gray-400 ml-1" />
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <input
                    type="range"
                    data-testid="return-rate-slider"
                    min="-0.1"
                    max="0.15"
                    step="0.001"
                    value={annualReturnRate}
                    onChange={(event) => setValue("annualReturnRate", Number(event.target.value), { shouldValidate: true })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-primary-600 w-16 text-right">{(annualReturnRate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex gap-3">
                  {returnRateOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue("annualReturnRate", option.value, { shouldValidate: true })}
                      className={cn(
                        "px-3 py-1 text-xs rounded-full border transition-colors",
                        Math.abs(annualReturnRate - option.value) < 0.001
                          ? "bg-primary-50 border-primary-500 text-primary-600"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  data-testid="advanced-toggle"
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <Settings className="w-4 h-4" />
                  高级设置
                </button>
                {showAdvanced && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    {incomeType === "with_salary" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">薪资增长率</label>
                        <div className="relative">
                          <input
                            type="number"
                            data-testid="salary-growth-input"
                            step="0.1"
                            value={(annualSalaryGrowthRate * 100).toFixed(1)}
                            onChange={(event) => updatePercentField("annualSalaryGrowthRate", event.target.value)}
                            className="w-full px-3 py-2 border border-blue-100 rounded-lg"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">%</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">被动收入增长率</label>
                      <div className="relative">
                        <input
                          type="number"
                          data-testid="passive-growth-input"
                          step="0.1"
                          value={(annualPassiveIncomeGrowthRate * 100).toFixed(1)}
                          onChange={(event) => updatePercentField("annualPassiveIncomeGrowthRate", event.target.value)}
                          className="w-full px-3 py-2 border border-blue-100 rounded-lg"
                        />
                        <span className="absolute right-3 top-2 text-sm text-gray-400">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">通货膨胀率</label>
                      <div className="relative">
                        <input
                          type="number"
                          data-testid="inflation-rate-input"
                          step="0.1"
                          value={(annualInflationRate * 100).toFixed(1)}
                          onChange={(event) => updatePercentField("annualInflationRate", event.target.value)}
                          className="w-full px-3 py-2 border border-blue-100 rounded-lg"
                        />
                        <span className="absolute right-3 top-2 text-sm text-gray-400">%</span>
                      </div>
                    </div>

                    {incomeType === "with_salary" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">停止工作年龄</label>
                        <div className="relative">
                          <input
                            type="number"
                            data-testid="salary-stop-age-input"
                            value={salaryStopAge || ""}
                            onChange={(event) =>
                              setValue("salaryStopAge", event.target.value === "" ? undefined : Number(event.target.value), {
                                shouldValidate: true,
                              })
                            }
                            className="w-full px-3 py-2 border border-blue-100 rounded-lg"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">岁</span>
                        </div>
                        {errors.salaryStopAge && <p className="text-sm text-red-600 mt-1">{errors.salaryStopAge.message}</p>}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">最大模拟年龄</label>
                      <div className="relative">
                        <input
                          type="number"
                          data-testid="max-age-input"
                          value={maxAge || ""}
                          onChange={(event) => setValue("maxAge", Number(event.target.value), { shouldValidate: true })}
                          className="w-full px-3 py-2 border border-blue-100 rounded-lg"
                        />
                        <span className="absolute right-3 top-2 text-sm text-gray-400">岁</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-blue-200 text-primary-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  重置
                </button>
                <button
                  type="submit"
                  data-testid="start-calculation"
                  className="flex-1 px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  开始计算
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-blue-100 p-6">
            <h3 className="font-bold text-gray-950 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary-600" />
              当前选择
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">模式</span>
                <span className="font-medium text-primary-600">{mode === "current_projection" ? "按现状推算" : "按目标推算"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">收入类型</span>
                <span className="font-medium text-primary-600">{incomeType === "with_salary" ? "有薪资收入" : "无薪资收入"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">城市</span>
                <span className="font-medium">{city.cityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">当前年龄</span>
                <span className="font-medium">{currentAge} 岁</span>
              </div>
              {targetAge && (
                <div className="flex justify-between">
                  <span className="text-gray-500">目标年龄</span>
                  <span className="font-medium">{targetAge} 岁</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">生活等级</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                  {currentLivingLevel} {LIVING_LEVELS[currentLivingLevel].label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">预计月结余</span>
                <span className={cn("font-medium", monthlySurplus >= 0 ? "text-green-600" : "text-red-600")}>
                  {monthlySurplus >= 0 ? "+" : ""}¥{monthlySurplus.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-100 p-6">
            <h3 className="font-bold text-gray-950 mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary-600" />
              结果将展示
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary-600 mt-0.5" />可维持到几岁</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary-600 mt-0.5" />年龄-资金曲线</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary-600 mt-0.5" />生活等级与风险等级</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary-600 mt-0.5" />滑杆模拟和调整建议</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Check className="w-4 h-4" />
              数据本地计算，结果仅供参考
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
