"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/app-context";
import { agentService, actionService } from "@/services";
import { AgentRun, AgentEvent, ActionTask } from "@/domain/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  Terminal,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

function AIWorkspaceContent() {
  const searchParams = useSearchParams();
  const { currentRole, currentMember, permissions } = useApp();

  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentRun, setCurrentRun] = useState<AgentRun | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [activeTask, setActiveTask] = useState<ActionTask | null>(null);
  const [isExecutingTask, setIsExecutingTask] = useState(false);
  const eventEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    {
      label: "Help me avoid a cash shortage next week",
      recommended: true,
      description: "Audits 7-day liquidity and prepares collection intervention",
    },
    {
      label: "Collect overdue receivables from Apex Retail",
      recommended: false,
      description: "Generates tailored collection notice and invoice terms",
    },
    {
      label: "Analyze operating expenses and supplier terms",
      recommended: false,
      description: "Surfaces payment deferral options for upcoming bills",
    },
    {
      label: "What if a client pays 14 days late?",
      recommended: false,
      description: "Simulates working capital stress under customer delay",
    },
  ];

  const handleStartGoal = async (customPrompt?: string) => {
    const goalText = customPrompt || prompt;
    if (!goalText.trim() || isRunning) return;

    setIsRunning(true);
    setEvents([]);
    setActiveTask(null);

    try {
      const run = await agentService.runAgentGoal(goalText, (event) => {
        setEvents((prev) => [...prev, event]);
        if (event.actionTaskId) {
          actionService.getActionTaskById(event.actionTaskId).then((task) => {
            if (task) setActiveTask(task);
          });
        }
      });
      setCurrentRun(run);

      // If proposed tasks exist, load the active task
      if (run.proposedTaskIds.length > 0) {
        const task = await actionService.getActionTaskById(run.proposedTaskIds[0]);
        if (task) setActiveTask(task);
      }
    } catch (err) {
      console.error("Agent run failed:", err);
    } finally {
      setIsRunning(false);
    }
  };

  // Pre-load prompt from query params if passed
  useEffect(() => {
    const queryPrompt = searchParams.get("prompt");
    if (queryPrompt && !currentRun) {
      setPrompt(queryPrompt);
      handleStartGoal(queryPrompt);
    }
  }, [searchParams]);

  useEffect(() => {
    eventEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const handleApproveAndExecute = async () => {
    if (!activeTask || isExecutingTask) return;
    setIsExecutingTask(true);

    try {
      // 1. Approve
      await actionService.approveActionTask(
        activeTask.id,
        currentMember?.id || "mem-1",
        currentMember?.name || "Active User",
        "Authorized autonomous intervention via AI Workspace"
      );

      // 2. Execute
      const executed = await actionService.executeActionTask(activeTask.id);
      setActiveTask(executed);

      // Add verified completion event to timeline
      const completeEvent: AgentEvent = {
        id: `evt-verified-${Date.now()}`,
        runId: currentRun?.id || "run-current",
        timestamp: new Date().toISOString(),
        type: "action_verified",
        message: `Action executed & verified: ${executed.verificationResult?.message}`,
        isSimulated: true,
      };
      setEvents((prev) => [...prev, completeEvent]);
    } catch (err) {
      console.error("Execution failed:", err);
    } finally {
      setIsExecutingTask(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slateSurface-200">
        <div>
          <h1 className="text-2xl font-bold text-forest tracking-tight flex items-center gap-2">
            Autonomous Financial Workspace
            <Badge variant="simulated" size="sm">
              Simulated
            </Badge>
          </h1>
          <p className="text-xs text-brand-700/70 mt-1">
            Observe → Investigate → Plan → Validate → Request Approval → Execute → Verify
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">
            Strict Permission Guard: Active
          </Badge>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700/60 block">
          Suggested Financial Goals (Click to Launch)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {suggestedPrompts.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setPrompt(p.label);
                handleStartGoal(p.label);
              }}
              disabled={isRunning}
              className={`text-left p-3 rounded-xl border text-xs transition-all ${
                p.recommended
                  ? "bg-forest text-white border-forest shadow-xs hover:bg-forest-light"
                  : "bg-white text-brand-900 border-slateSurface-200 hover:border-brand-300 hover:bg-slateSurface-50"
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                {p.recommended && (
                  <Sparkles className="w-3.5 h-3.5 text-lime-accent shrink-0" />
                )}
                <span>{p.label}</span>
              </div>
              <p
                className={`text-[11px] mt-1 line-clamp-1 ${
                  p.recommended ? "text-slateSurface-300" : "text-brand-700/60"
                }`}
              >
                {p.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Execution Stream (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="flex flex-col h-[640px]">
            <CardHeader className="py-3 px-5 border-b border-slateSurface-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-forest-action" />
                <CardTitle className="text-sm">Agent Investigation Stream</CardTitle>
                {isRunning && (
                  <Badge variant="lime" size="sm" className="animate-pulse">
                    Executing Tools...
                  </Badge>
                )}
              </div>
              <Badge variant="outline" size="sm">
                Deterministic Engine
              </Badge>
            </CardHeader>

            {/* Scrollable Event Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slateSurface-50/40">
              {events.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-brand-700/60">
                  <Bot className="w-10 h-10 text-brand-300 mb-2" />
                  <p className="text-sm font-semibold text-brand-900">
                    Agent Ready to Investigate
                  </p>
                  <p className="text-xs max-w-sm mt-1">
                    Select a suggested goal above or type a custom financial objective below to launch the autonomous investigation loop.
                  </p>
                </div>
              ) : (
                events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 bg-white border border-slateSurface-200 rounded-xl shadow-xs animate-in fade-in space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-brand-900">
                        {evt.type === "plan_created" && (
                          <FileCheck className="w-4 h-4 text-forest-action" />
                        )}
                        {evt.type.startsWith("tool_") && (
                          <Terminal className="w-4 h-4 text-blue-600" />
                        )}
                        {evt.type === "evidence_found" && (
                          <Sparkles className="w-4 h-4 text-amber-500" />
                        )}
                        {evt.type === "approval_requested" && (
                          <ShieldAlert className="w-4 h-4 text-amber-600" />
                        )}
                        {evt.type === "action_verified" && (
                          <CheckCircle2 className="w-4 h-4 text-success-600" />
                        )}
                        <span className="uppercase tracking-wider text-[10px] text-brand-700/70">
                          {evt.type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <Badge variant="simulated" size="sm">
                        Simulated
                      </Badge>
                    </div>

                    <p className="text-brand-900 leading-relaxed whitespace-pre-line">
                      {evt.message}
                    </p>

                    {/* Tool Arguments or Results Preview */}
                    {evt.toolArgs && (
                      <div className="p-2 bg-slateSurface-100 rounded text-[11px] font-mono text-brand-800 overflow-x-auto">
                        <span className="text-brand-700/60 select-none">Tool Args: </span>
                        {JSON.stringify(evt.toolArgs)}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={eventEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slateSurface-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStartGoal();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter a financial goal (e.g., 'Help me avoid a cash shortage next week')..."
                  disabled={isRunning}
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slateSurface-50 border border-slateSurface-200 rounded-lg text-brand-900 placeholder:text-brand-700/40 focus:outline-none focus:ring-2 focus:ring-forest-action"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isRunning}
                  disabled={!prompt.trim() || isRunning}
                >
                  <Send className="w-4 h-4" />
                  Investigate
                </Button>
              </form>
            </div>
          </Card>
        </div>

        {/* Right Column: Reasoning, Evidence & Approval Card (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Action Approval Card */}
          {activeTask ? (
            <Card className="border-2 border-forest-action/30 shadow-cardHover">
              <CardHeader className="bg-brand-50/50 py-3 px-5 border-b border-brand-100">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <CardTitle className="text-sm">Human Approval Required</CardTitle>
                  </div>
                  <Badge
                    variant={
                      activeTask.status === "completed"
                        ? "success"
                        : activeTask.status === "approved"
                        ? "lime"
                        : "warning"
                    }
                    size="sm"
                  >
                    {activeTask.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-brand-900">
                    {activeTask.title}
                  </h4>
                  <p className="text-xs text-brand-700/80 mt-1 leading-relaxed">
                    {activeTask.description}
                  </p>
                </div>

                <div className="p-3 bg-slateSurface-100 rounded-lg text-xs space-y-1.5">
                  <div className="text-brand-700/70">
                    <strong className="text-brand-900">Why this action:</strong>{" "}
                    {activeTask.reason}
                  </div>
                  <div className="text-forest font-semibold">
                    <strong>Expected Impact:</strong> {activeTask.expectedOutcome}
                  </div>
                </div>

                {/* Verification Result if already executed */}
                {activeTask.verificationResult && (
                  <div className="p-3.5 bg-success-50 border border-success-200 rounded-lg text-xs space-y-1 animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-bold text-success-800">
                      <CheckCircle2 className="w-4 h-4 text-success-600" />
                      Action Verified (Simulated Delivery)
                    </div>
                    <p className="text-success-900/80 text-[11px] leading-relaxed">
                      {activeTask.verificationResult.message}
                    </p>
                  </div>
                )}

                {/* Role Permission Banner */}
                {!permissions.canApproveActions && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                    ⚠️ Your current role (<strong>{currentRole}</strong>) is read-only for approvals. Switch to <strong>Owner</strong> or <strong>Admin</strong> in the topbar to authorize.
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href={`/action-center?taskId=${activeTask.id}`}
                    className="text-xs font-semibold text-forest-action hover:underline"
                  >
                    Inspect in Action Center
                  </Link>

                  {activeTask.status === "pending_approval" && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isExecutingTask}
                      disabled={!permissions.canApproveActions || isExecutingTask}
                      onClick={handleApproveAndExecute}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Approve & Execute
                    </Button>
                  )}

                  {activeTask.status === "completed" && (
                    <Link href="/cash-flow">
                      <Button variant="lime" size="sm">
                        View Updated Cash Curve
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="py-3 px-5">
                <CardTitle className="text-sm">Action Execution Guard</CardTitle>
              </CardHeader>
              <CardContent className="p-5 text-center text-xs text-brand-700/60">
                The agent cannot execute external communication or ledger adjustments without producing an actionable proposal for your review.
              </CardContent>
            </Card>
          )}

          {/* Reasoning & Verified Facts Breakdown */}
          {currentRun && (
            <Card>
              <CardHeader className="py-3 px-5 border-b border-slateSurface-100">
                <CardTitle className="text-sm">Auditable Evidence & Facts</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div>
                  <span className="font-bold text-forest uppercase tracking-wider text-[10px] block mb-1">
                    Verified Facts (From Ledger)
                  </span>
                  <ul className="space-y-1.5">
                    {currentRun.verifiedFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-brand-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-action shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {currentRun.assumptions.length > 0 && (
                  <div className="pt-3 border-t border-slateSurface-100">
                    <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px] block mb-1">
                      Assumptions & Projections
                    </span>
                    <ul className="space-y-1.5">
                      {currentRun.assumptions.map((asm, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-brand-800">
                          <span className="text-amber-500 font-bold shrink-0">•</span>
                          <span>{asm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIWorkspacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-brand-700">Loading AI Workspace...</div>}>
      <AIWorkspaceContent />
    </Suspense>
  );
}
