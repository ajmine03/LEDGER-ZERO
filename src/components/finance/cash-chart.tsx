"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { DailyCashProjection } from "@/lib/finance/engine";
import { formatMinorUnits } from "@/lib/money";
import { useApp } from "@/context/app-context";
import { formatShortDate } from "@/lib/dates";

export interface CashChartProps {
  projections: DailyCashProjection[];
  height?: number;
  showInflowsOutflows?: boolean;
}

export function CashChart({ projections, height = 280 }: CashChartProps) {
  const { countryConfig, activeCurrency } = useApp();

  const chartData = projections.map((p) => ({
    date: p.date,
    formattedDate: formatShortDate(p.date),
    closingCash: p.closingCash,
    cashMajor: p.closingCash / Math.pow(10, countryConfig.minorUnitDecimals),
    expectedInflows: p.expectedInflows / Math.pow(10, countryConfig.minorUnitDecimals),
    scheduledOutflows: p.scheduledOutflows / Math.pow(10, countryConfig.minorUnitDecimals),
    isShortfall: p.isShortfall,
  }));

  const minCash = Math.min(...projections.map((p) => p.closingCash), 0);
  const maxCash = Math.max(...projections.map((p) => p.closingCash), 100000);
  const factor = Math.pow(10, countryConfig.minorUnitDecimals);

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#183B2A" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#183B2A" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="shortfallGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8E4" />
          <XAxis
            dataKey="formattedDate"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#5d7365", fontSize: 11 }}
          />
          <YAxis
            domain={[minCash / factor * 1.1, maxCash / factor * 1.1]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#5d7365", fontSize: 11 }}
            tickFormatter={(val) => `${val >= 0 ? "" : "-"}$${Math.abs(val).toLocaleString()}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const isNegative = data.closingCash < 0;
                return (
                  <div className="bg-brand-950 text-white p-3 rounded-xl shadow-dropdown border border-brand-800 text-xs">
                    <p className="font-semibold text-slateSurface-200 mb-1">
                      {data.date}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slateSurface-300">Projected Balance:</span>
                      <span
                        className={`font-mono font-bold ${
                          isNegative ? "text-risk-400" : "text-lime-accent"
                        }`}
                      >
                        {formatMinorUnits(data.closingCash, activeCurrency, countryConfig.locale)}
                      </span>
                    </div>
                    {data.isShortfall && (
                      <p className="mt-1 text-[11px] text-risk-300 font-semibold">
                        ⚠️ Deficit below zero liquidity threshold
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />

          <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" label={{ value: "Zero Reserve", fill: "#DC2626", fontSize: 10, position: "insideBottomLeft" }} />

          <Area
            type="monotone"
            dataKey="cashMajor"
            stroke="#183B2A"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#cashGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
