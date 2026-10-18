"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DemoBanner() {
  const { isSimulatedDemo, resetDemo } = useApp();

  if (!isSimulatedDemo) return null;

  return (
    <div className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-500/20 dark:border-amber-800/40 px-4 py-2 text-xs text-amber-950 dark:text-amber-200 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Badge variant="simulated" size="sm">
          Simulated Demo
        </Badge>
        <span className="font-medium text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          Fictional workspace for <strong className="text-amber-950 dark:text-amber-100">Harbor & Pine Supply Co.</strong> No real bank movement or external emails. All AI insights & actions run on a swap-ready mock service layer.
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-amber-800/80 dark:text-amber-300/80 hidden sm:inline">
          Data mode: <code className="bg-amber-200/50 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-[11px] font-mono">mock</code>
        </span>
        <button
          onClick={resetDemo}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:text-amber-100 bg-amber-200/60 dark:bg-amber-800/50 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          title="Reset Harbor & Pine Supply Co. demo data"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Demo
        </button>
      </div>
    </div>
  );
}
