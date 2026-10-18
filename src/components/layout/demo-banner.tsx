"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DemoBanner() {
  const { isSimulatedDemo, resetDemo } = useApp();

  if (!isSimulatedDemo) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Badge variant="simulated" size="sm">
          Simulated Demo
        </Badge>
        <span className="font-medium text-amber-900 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Fictional workspace for <strong>Harbor & Pine Supply Co.</strong> No real bank movement or external emails. All AI insights & actions run on a swap-ready mock service layer.
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-amber-800/80 hidden sm:inline">
          Data mode: <code className="bg-amber-200/50 px-1.5 py-0.5 rounded text-[11px] font-mono">mock</code>
        </span>
        <button
          onClick={resetDemo}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-200/60 hover:bg-amber-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          title="Reset Harbor & Pine Supply Co. demo data"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Demo
        </button>
      </div>
    </div>
  );
}
