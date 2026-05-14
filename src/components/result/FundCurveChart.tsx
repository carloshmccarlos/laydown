"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { CalculatorResult } from "@/lib/types";
import { buildFundCurveData } from "@/lib/engine/simulation";

interface Props {
  result: CalculatorResult;
}

export default function FundCurveChart({ result }: Props) {
  const data = useMemo(() => buildFundCurveData(result.yearlyResults), [result.yearlyResults]);
  const depletionPoint = data.find((d) => d.balance < 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-950">
          年龄-资金曲线{" "}
          <span className="text-sm font-normal text-slate-500">（单位：万元）</span>
        </h3>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-0.5 w-7 bg-primary-600" />
            资金余额
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-0.5 w-7 border-t border-dashed border-red-400" />
            资金耗尽线
          </span>
        </div>
      </div>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.map((d) => ({ ...d, balanceWan: Math.round(d.balance / 10000) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eef7" />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              label={{ value: "年龄（岁）", position: "insideBottom", offset: -5, fontSize: 12, fill: '#64748b' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              label={{ value: "资金余额（万元）", angle: -90, position: "insideLeft", fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip
              formatter={(value: number) => [`${(value * 10000).toLocaleString()} 元`, "资金余额"]}
              labelFormatter={(label: number) => `${label} 岁`}
              contentStyle={{ borderRadius: '8px', border: '1px solid #dbeafe', fontSize: '12px', boxShadow: '0 2px 8px rgba(15,23,42,0.08)' }}
            />
            <ReferenceLine
              y={0}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: "资金耗尽线", position: "insideBottomRight", fontSize: 10, fill: "#ef4444" }}
            />
            {result.targetAge && (
              <ReferenceLine
                x={result.targetAge}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{ value: "目标年龄", position: "top", fontSize: 10, fill: "#10b981" }}
              />
            )}
            {depletionPoint && (
              <ReferenceLine
                x={depletionPoint.age}
                stroke="#ef4444"
                label={{ value: `耗尽 ${depletionPoint.age}岁`, position: "top", fontSize: 10, fill: "#ef4444" }}
              />
            )}
            <Line
              type="monotone"
              dataKey="balanceWan"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              name="资金余额"
              activeDot={{ r: 4, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
