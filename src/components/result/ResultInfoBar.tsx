"use client";

import { CalculatorFormState, CalculatorResult } from "@/lib/types";
import { getLivingLevelLabel, getLivingLevelColor } from "@/lib/engine/living-level";
import { getCityByCode } from "@/lib/data/cities";
import { MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  result: CalculatorResult;
  formState: CalculatorFormState;
}

export default function ResultInfoBar({ result, formState }: Props) {
  const city = getCityByCode(formState.cityCode);

  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm shadow-slate-100 md:grid-cols-3 md:divide-x md:divide-slate-200">
      <div className="flex items-center justify-center gap-2 text-sm md:justify-start">
        <span className="text-slate-500">当前生活等级</span>
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border", getLivingLevelColor(result.currentLivingLevel))}>
          {result.currentLivingLevel}
        </span>
        <span className="font-medium text-gray-700">{getLivingLevelLabel(result.currentLivingLevel)}</span>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <MapPin className="h-5 w-5 text-slate-500" />
        <span className="text-slate-500">城市：</span>
        <span className="font-medium text-gray-700">{city?.cityName || "上海"}</span>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm md:justify-end">
        <User className="h-5 w-5 text-primary-600" />
        <span className="text-slate-500">当前年龄：</span>
        <span className="font-medium text-gray-700">{result.currentAge} 岁</span>
      </div>
    </div>
  );
}
