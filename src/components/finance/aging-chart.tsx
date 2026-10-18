"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AgingBucket } from "@/lib/finance/engine";
import { formatMinorUnits } from "@/lib/money";
import { useApp } from "@/context/app-context";

export function AgingChart({ buckets, height = 240 }: { buckets: AgingBucket[]; height?: number }) {
  const { countryConfig, activeCurrency } = useApp();
  const factor = Math.pow(10, countryConfig.minorUnitDecimals);

  const data = buckets.map((b) => ({
    label: b.label,
    amount: b.amount,
    amountMajor: b.amount / factor,
    count: b.count,
  }));

  const getBarColor = (label: string) => {
    switch (label) {
      case "Current":
        return "#183B2A"; // Brand green
      case "1-30 Days":
        return "#F59E0B"; // Amber
      case "31-60 Days":
        return "#EA580C"; // Orange
      case "61-90 Days":
      case "90+ Days":
        return "#DC2626"; // Red
      default:
        return "#183B2A";
    }
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8E4" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#5d7365", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#5d7365", fontSize: 11 }}
            tickFormatter={(val) => `$${val.toLocaleString()}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-brand-950 text-white p-2.5 rounded-xl shadow-dropdown text-xs">
                    <p className="font-semibold text-slateSurface-200">{item.label}</p>
                    <p className="text-lime-accent font-mono font-bold mt-0.5">
                      {formatMinorUnits(item.amount, activeCurrency, countryConfig.locale)}
                    </p>
                    <p className="text-slateSurface-400 text-[11px] mt-1">
                      {item.count} invoice{item.count === 1 ? "" : "s"}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="amountMajor" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.label)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
