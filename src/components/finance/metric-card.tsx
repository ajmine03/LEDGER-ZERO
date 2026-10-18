"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyAmount } from "./currency-amount";
import { Info, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  amount: number; // minor units
  currency?: string;
  definition: string;
  period: string;
  source: string;
  href?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "risk" | "warning" | "success";
  className?: string;
}

export function MetricCard({
  title,
  amount,
  currency,
  definition,
  period,
  source,
  href,
  trend,
  variant = "default",
  className,
}: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const variantBorder = {
    default: "border-slateSurface-200 hover:border-brand-300",
    risk: "border-risk-300 bg-risk-50/20 hover:border-risk-400",
    warning: "border-warning-300 bg-warning-50/20 hover:border-warning-400",
    success: "border-success-300 bg-success-50/20 hover:border-success-400",
  };

  const cardContent = (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-cardHover group",
        variantBorder[variant],
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700/80">
              {title}
            </span>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={(e) => {
                  e.preventDefault();
                  setShowTooltip(!showTooltip);
                }}
                className="text-brand-700/40 hover:text-brand-900 transition-colors p-0.5"
                aria-label={`Definition for ${title}`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {showTooltip && (
                <div className="absolute left-0 top-6 z-30 w-64 p-3 bg-slate-900 dark:bg-slate-950 text-white text-xs rounded-xl border border-slate-700 shadow-xl leading-relaxed pointer-events-none animate-in fade-in duration-100">
                  <p className="font-semibold text-emerald-400 mb-1">{title} Definition</p>
                  <p className="mb-2 text-slate-200">{definition}</p>
                  <div className="pt-2 border-t border-slate-700 text-[11px] text-slate-400">
                    <span className="font-medium text-white">Period:</span> {period}
                    <br />
                    <span className="font-medium text-white">Source:</span> {source}
                  </div>
                </div>
              )}
            </div>
          </div>

          {href && (
            <ArrowUpRight className="w-4 h-4 text-brand-700/40 group-hover:text-brand-900 transition-colors" />
          )}
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-2xl font-bold text-brand-900">
            <CurrencyAmount amount={amount} currency={currency} />
          </div>
          {trend && (
            <span
              className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full",
                trend.isPositive
                  ? "bg-success-50 text-success-700"
                  : "bg-risk-50 text-risk-700"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-brand-700/60 pt-2 border-t border-slateSurface-100">
          <span>{period}</span>
          <span className="truncate max-w-[140px] text-right font-medium text-brand-800/80">
            {source}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-forest-action rounded-xl">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
