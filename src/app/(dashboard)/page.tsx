"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/app-context";
import { dataService, actionService } from "@/services";
import {
  CashPosition,
  ReceivablesSummary,
  PayablesSummary,
  CashFlowForecast,
  AgingBucket,
  AnomalyFlag,
} from "@/lib/finance/engine";
import { ActionTask, AuditLog } from "@/domain/types";
import { MetricCard } from "@/components/finance/metric-card";
import { CashChart } from "@/components/finance/cash-chart";
import { AgingChart } from "@/components/finance/aging-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CurrencyAmount } from "@/components/finance/currency-amount";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { formatShortDate } from "@/lib/dates";

export default function OverviewPage() {
  const { permissions, currentRole } = useApp();
  const [cashPos, setCashPos] = useState<CashPosition | null>(null);
  const [recSummary, setRecSummary] = useState<ReceivablesSummary | null>(null);
  const [paySummary, setPaySummary] = useState<PayablesSummary | null>(null);
  const [forecast, setForecast] = useState<CashFlowForecast | null>(null);
  const [forecastDays, setForecastDays] = useState<7 | 30>(7);
  const [agingBuckets, setAgingBuckets] = useState<AgingBucket[]>([]);
  const [pendingTasks, setPendingTasks] = useState<ActionTask[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyFlag[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = React.useCallback(async () => {
    try {
      const [cp, rs, ps, fc, ab, tasks, anom, logs] = await Promise.all([
        dataService.getCashPosition(),
        dataService.getReceivablesSummary(),
        dataService.getPayablesSummary(),
        dataService.getForecast(forecastDays),
        dataService.getReceivablesAging(),
        actionService.getActionTasks({ status: "pending_approval" }),
        dataService.getAnomalies(),
        dataService.getAuditLogs(6),
      ]);
      setCashPos(cp);
      setRecSummary(rs);
      setPaySummary(ps);
      setForecast(fc);
      setAgingBuckets(ab);
      setPendingTasks(tasks);
      setAnomalies(anom);
      setRecentLogs(logs);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [forecastDays]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const net7DayGap = (cashPos?.currentCash || 0) - (paySummary?.dueWithin7Days || 0);
  const hasShortfall = (forecast && forecast.minimumCash < 0) || net7DayGap < 0;

  return (
    <div className="space-y-6">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slateSurface-200">
        <div>
          <h1 className="text-2xl font-bold text-forest tracking-tight flex items-center gap-2">
            Financial Command Center
            <Badge variant="simulated" size="sm">
              Simulated
            </Badge>
          </h1>
          <p className="text-xs text-brand-700/70 mt-1">
            Real-time liquidity surveillance, deterministic forecasting, and agent-driven interventions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/ai-workspace">
            <Button variant="lime" size="sm" className="shadow-xs">
              <Bot className="w-4 h-4 text-forest" />
              Launch AI Workspace
            </Button>
          </Link>
          <Link href="/action-center">
            <Button variant="outline" size="sm">
              <Zap className="w-4 h-4 text-amber-600" />
              Action Queue ({pendingTasks.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Critical Liquidity Alert Banner */}
      {hasShortfall && (
        <div className="bg-risk-50 border-l-4 border-risk-500 p-4 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-risk-100 rounded-lg text-risk-600 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-risk-700">
                  CRITICAL: Projected Working Capital Shortfall Detected
                </h4>
                <Badge variant="risk" size="sm">
                  Deficit on {forecast?.firstShortfallDate || "Oct 21"}
                </Badge>
              </div>
              <p className="text-xs text-risk-800/80 mt-1 max-w-2xl leading-relaxed">
                Available cash of <strong>$20,000.00</strong> will be depleted by upcoming supplier obligations of <strong>$45,000.00</strong> within 5 days, causing a projected gap of <strong>-$25,000.00</strong>.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link href="/ai-workspace?prompt=Help%20me%20avoid%20a%20cash%20shortage%20next%20week">
              <Button variant="danger" size="sm" className="shadow-sm">
                <Sparkles className="w-4 h-4" />
                Investigate with AI
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Top 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Confirmed Cash Position"
          amount={cashPos?.currentCash || 0}
          definition="Total verified liquid funds across all business operating accounts."
          period="Current balance"
          source="Bank ledger & settled transactions"
          href="/transactions"
          trend={{ value: "+$4,500 settled", isPositive: true }}
        />

        <MetricCard
          title="Customer Receivables"
          amount={recSummary?.totalReceivables || 0}
          definition="Total unpaid invoices issued to customers minus partial collections."
          period="Open receivables"
          source="Customer accounts ledger"
          href="/receivables"
          variant={recSummary?.overdueAmount ? "warning" : "default"}
        />

        <MetricCard
          title="7-Day Payables Due"
          amount={paySummary?.dueWithin7Days || 0}
          definition="Supplier bills and committed vendor invoices maturing within 7 calendar days."
          period="Next 7 days"
          source="Accounts payable ledger"
          href="/payables"
          variant="risk"
        />

        <MetricCard
          title="7-Day Liquidity Buffer"
          amount={net7DayGap}
          definition="Projected cash balance in 7 days assuming zero additional customer collections."
          period="T+7 days"
          source="Deterministic forecast engine"
          href="/cash-flow"
          variant={net7DayGap < 0 ? "risk" : "success"}
          trend={{ value: net7DayGap < 0 ? "Shortfall alert" : "Surplus", isPositive: net7DayGap >= 0 }}
        />
      </div>

      {/* Main Charts & Investigation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Forecast Chart (2 Columns) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                Cash Balance Trajectory
                <Badge variant="outline" size="sm">
                  Deterministic
                </Badge>
              </CardTitle>
              <p className="text-xs text-brand-700/70 mt-0.5">
                Projections calculated directly from open invoice due dates and settled cash positions.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slateSurface-100 p-1 rounded-lg border border-slateSurface-200">
              <button
                onClick={() => setForecastDays(7)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  forecastDays === 7 ? "bg-surface text-forest font-bold shadow-xs border border-slateSurface-200" : "text-brand-700 hover:text-brand-900"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setForecastDays(30)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  forecastDays === 30 ? "bg-surface text-forest font-bold shadow-xs border border-slateSurface-200" : "text-brand-700 hover:text-brand-900"
                }`}
              >
                30 Days
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {forecast && <CashChart projections={forecast.dailyProjections} height={280} />}

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slateSurface-100 text-xs">
              <div>
                <span className="text-brand-700/60 block">Minimum Cash</span>
                <span className={`font-mono font-bold text-sm ${forecast?.minimumCash! < 0 ? "text-risk-600" : "text-forest"}`}>
                  <CurrencyAmount amount={forecast?.minimumCash || 0} colored />
                </span>
              </div>
              <div>
                <span className="text-brand-700/60 block">Expected 7D Inflows</span>
                <span className="font-mono font-bold text-sm text-forest">
                  <CurrencyAmount amount={forecast?.totalExpectedInflows || 0} />
                </span>
              </div>
              <div>
                <span className="text-brand-700/60 block">Scheduled 7D Outflows</span>
                <span className="font-mono font-bold text-sm text-risk-600">
                  <CurrencyAmount amount={forecast?.totalScheduledOutflows || 0} />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receivables Aging Schedule (1 Column) */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Receivables Aging</CardTitle>
              <p className="text-xs text-brand-700/70 mt-0.5">
                Overdue customer balances by aging bracket
              </p>
            </div>
            <Link href="/receivables" className="text-xs font-semibold text-forest-action hover:underline">
              View All
            </Link>
          </CardHeader>

          <CardContent>
            <AgingChart buckets={agingBuckets} height={210} />

            <div className="mt-4 p-3 bg-warning-50/50 border border-warning-200 rounded-lg text-xs">
              <div className="flex items-center justify-between font-semibold text-warning-800">
                <span>Apex Retail Partners</span>
                <span className="font-mono">$15,000.00</span>
              </div>
              <p className="text-brand-700/70 text-[11px] mt-1">
                Invoice INV-2026-089 is <strong>6 days overdue</strong>. Recommended for expedited collection with 2% discount incentive.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Center Queue & Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Actions Requiring Human Approval */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <CardTitle>Autonomous Action Queue</CardTitle>
              <Badge variant="warning" size="sm">
                {pendingTasks.length} Pending Approval
              </Badge>
            </div>
            <Link href="/action-center" className="text-xs font-semibold text-forest-action hover:underline">
              Open Action Center
            </Link>
          </CardHeader>

          <CardContent className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-brand-700/60">
                No actions currently pending approval. All proposed interventions have been resolved.
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-slateSurface-200 rounded-xl bg-surfaceSubtle hover:border-brand-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={task.riskLevel === "high" ? "risk" : "warning"}
                          size="sm"
                        >
                          {task.riskLevel.toUpperCase()} RISK
                        </Badge>
                        <span className="text-[10px] text-brand-700 font-medium">
                          Requires {task.requiredRole} approval
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-brand-900 mt-1.5">
                        {task.title}
                      </h4>
                      <p className="text-xs text-brand-700 mt-1 leading-relaxed">
                        {task.reason}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-surface rounded-lg text-xs text-brand-800 border border-slateSurface-200">
                    <span className="font-semibold text-forest">Expected Outcome:</span>{" "}
                    {task.expectedOutcome}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={`/action-center?taskId=${task.id}`}
                      className="text-xs font-semibold text-forest-action hover:underline"
                    >
                      Inspect Evidence & Review
                    </Link>

                    <Link href={`/action-center?taskId=${task.id}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!permissions.canApproveActions}
                      >
                        Review & Approve
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Autonomous Agent Audit Trail */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-forest-action" />
              <CardTitle>Autonomous Agent Activity & Audit Trail</CardTitle>
            </div>
            <Link href="/audit-logs" className="text-xs font-semibold text-forest-action hover:underline">
              Full Audit Log
            </Link>
          </CardHeader>

          <CardContent>
            <div className="space-y-3.5">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className="mt-0.5 p-1 rounded-full bg-slateSurface-100 text-brand-700 shrink-0">
                    {log.actorType === "agent" ? (
                      <Bot className="w-3.5 h-3.5 text-forest-action" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-brand-900 truncate">
                        {log.actorName}
                      </span>
                      <span className="text-[10px] text-brand-700/50 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatShortDate(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-brand-700/80 mt-0.5 leading-relaxed">
                      {log.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
