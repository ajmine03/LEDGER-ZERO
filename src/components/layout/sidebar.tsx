"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Zap,
  TrendingUp,
  Receipt,
  FileText,
  Users,
  Building2,
  PieChart,
  BarChart3,
  History,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { actionService } from "@/services";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const tasks = await actionService.getActionTasks({ status: "pending_approval" });
        setPendingApprovalsCount(tasks.length);
      } catch {
        // Ignore in unmounted state
      }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 4000);
    return () => clearInterval(interval);
  }, [pathname]);

  const navigationGroups: NavGroup[] = [
    {
      label: "Autonomous Hub",
      items: [
        { name: "Overview", href: "/", icon: LayoutDashboard },
        { name: "AI Workspace", href: "/ai-workspace", icon: Bot },
        {
          name: "Action Center",
          href: "/action-center",
          icon: Zap,
          badge: pendingApprovalsCount,
        },
        { name: "Cash Flow & Scenarios", href: "/cash-flow", icon: TrendingUp },
      ],
    },
    {
      label: "Ledger & Operations",
      items: [
        { name: "Transactions", href: "/transactions", icon: Receipt },
        { name: "Invoices", href: "/invoices", icon: FileText },
        { name: "Customers & Receivables", href: "/receivables", icon: Users },
        { name: "Suppliers & Payables", href: "/payables", icon: Building2 },
      ],
    },
    {
      label: "Intelligence & Team",
      items: [
        { name: "Budgets", href: "/budgets", icon: PieChart },
        { name: "Reports & Insights", href: "/reports", icon: BarChart3 },
        { name: "Agent Audit Logs", href: "/audit-logs", icon: History },
        { name: "Team & Permissions", href: "/team", icon: ShieldCheck },
        { name: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-slateSurface-200 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slateSurface-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-lime-accent font-black text-lg shadow-sm">
          Ø
        </div>
        <div>
          <div className="font-bold text-base tracking-tight text-forest flex items-center gap-1.5">
            LEDGER ZERO
          </div>
          <div className="text-[10px] uppercase font-semibold tracking-wider text-brand-700/60">
            by NULL PROTOCOL
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-brand-700/50">
              {group.label}
            </div>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors group relative",
                      isActive
                        ? "bg-brand-50 text-forest font-semibold"
                        : "text-brand-800/80 hover:bg-slateSurface-100 hover:text-brand-900"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-colors",
                          isActive
                            ? "text-forest-action"
                            : "text-brand-700/60 group-hover:text-brand-900"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-forest-action rounded-r-md" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Product Principle footer */}
      <div className="p-3 border-t border-slateSurface-100 bg-slateSurface-50/50">
        <div className="text-[10px] font-bold text-forest tracking-wide uppercase mb-1">
          Observe → Plan → Verify
        </div>
        <p className="text-[11px] text-brand-700/70 leading-relaxed">
          Autonomous financial decisions require explicit human authorization.
        </p>
      </div>
    </aside>
  );
}
