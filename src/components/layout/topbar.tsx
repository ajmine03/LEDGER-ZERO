"use client";

import React, { useState } from "react";
import { useApp } from "@/context/app-context";
import {
  Globe,
  Shield,
  ChevronDown,
  Building,
  User,
  Search,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { Role } from "@/domain/types";
import { Badge } from "@/components/ui/badge";
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

export function Topbar() {
  const {
    business,
    currentMember,
    currentRole,
    countryConfig,
    theme,
    resolvedTheme,
    setTheme,
    switchRole,
    switchCountryPreset,
  } = useApp();

  const pathname = usePathname();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLocaleDropdown, setShowLocaleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const availableRoles: Role[] = ["Owner", "Admin", "Accountant", "Viewer"];

  const localePresets = [
    { code: "US", label: "USD - United States ($)", flag: "🇺🇸" },
    { code: "EU", label: "EUR - European Union (€)", flag: "🇪🇺" },
    { code: "BD", label: "BDT - Bangladesh (৳)", flag: "🇧🇩" },
    { code: "GB", label: "GBP - United Kingdom (£)", flag: "🇬🇧" },
    { code: "IN", label: "INR - India (₹)", flag: "🇮🇳" },
  ];

  const mobileNavLinks = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "AI Workspace", href: "/ai-workspace", icon: Bot },
    { name: "Action Center", href: "/action-center", icon: Zap },
    { name: "Cash Flow & Scenarios", href: "/cash-flow", icon: TrendingUp },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Receivables", href: "/receivables", icon: Users },
    { name: "Payables", href: "/payables", icon: Building2 },
    { name: "Budgets", href: "/budgets", icon: PieChart },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Audit Logs", href: "/audit-logs", icon: History },
    { name: "Team", href: "/team", icon: ShieldCheck },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <header className="h-16 bg-surface border-b border-slateSurface-200 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-20">
        {/* Left: Mobile menu toggle + Business entity indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg lg:hidden hover:bg-slateSurface-100 text-forest"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slateSurface-100 border border-slateSurface-200">
            <Building className="w-3.5 h-3.5 text-forest-action shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-brand-900 truncate max-w-[130px] sm:max-w-none">
              {business?.name || "Harbor & Pine Supply Co."}
            </span>
            <Badge variant="outline" size="sm" className="hidden md:inline-flex text-[10px]">
              Active
            </Badge>
          </div>
        </div>

        {/* Middle: Quick search bar */}
        <div className="hidden xl:flex items-center relative w-64">
          <Search className="w-4 h-4 text-brand-700/50 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ledger..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slateSurface-100 border border-slateSurface-200 rounded-lg text-brand-900 focus:outline-none focus:ring-1 focus:ring-forest-action placeholder:text-brand-700/40"
          />
        </div>

        {/* Right: Controls, Theme Switcher, & Judge Switchers */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Theme Switcher 1-Click Toggle */}
          <button
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
              setShowLocaleDropdown(false);
              setShowRoleDropdown(false);
            }}
            className="p-2 rounded-lg bg-slateSurface-100 hover:bg-slateSurface-200 text-brand-900 border border-slateSurface-200 transition-colors"
            title={`Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label={`Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {resolvedTheme === "dark" ? (
              <Moon className="w-4 h-4 text-lime-accent" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Country / Currency Preset Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLocaleDropdown(!showLocaleDropdown);
                setShowRoleDropdown(false);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 rounded-lg bg-slateSurface-100 hover:bg-slateSurface-200 text-xs font-medium text-brand-900 border border-slateSurface-200 transition-colors"
              title="Switch Locale & Currency Preset"
            >
              <Globe className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span className="font-mono font-semibold">{countryConfig.defaultCurrency}</span>
              <ChevronDown className="w-3 h-3 text-brand-700/60" />
            </button>

            {showLocaleDropdown && (
              <div className="absolute right-0 top-10 w-56 sm:w-60 bg-surface rounded-xl shadow-dropdown border border-slateSurface-200 py-1 z-30 animate-in fade-in duration-100">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-brand-700/60 border-b border-slateSurface-100">
                  Preset Currency & Format
                </div>
                {localePresets.map((preset) => (
                  <button
                    key={preset.code}
                    onClick={() => {
                      switchCountryPreset(preset.code);
                      setShowLocaleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slateSurface-100 ${
                      countryConfig.code === preset.code ? "bg-brand-50 text-forest font-semibold" : "text-brand-900"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{preset.flag}</span>
                      <span>{preset.label}</span>
                    </span>
                    {countryConfig.code === preset.code && (
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-action" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher (For Judges) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowLocaleDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-forest-action text-white hover:bg-forest-actionHover text-xs font-medium transition-colors shadow-xs"
              title="Switch Team Role (Judge Test Feature)"
            >
              <Shield className="w-3.5 h-3.5 text-lime-accent shrink-0" />
              <span className="font-semibold hidden xs:inline">{currentRole}</span>
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 top-10 w-56 bg-surface rounded-xl shadow-dropdown border border-slateSurface-200 py-1 z-30 animate-in fade-in duration-100">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-brand-700/60 border-b border-slateSurface-100">
                  Judge Role Switcher
                </div>
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slateSurface-100 ${
                      currentRole === role ? "bg-brand-50 text-forest font-semibold" : "text-brand-900"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{role}</div>
                      <div className="text-[10px] text-brand-700/60">
                        {role === "Owner" && "Full administrative authorization"}
                        {role === "Admin" && "Operations & approvals"}
                        {role === "Accountant" && "Financial editor, no approvals"}
                        {role === "Viewer" && "Read-only access"}
                      </div>
                    </div>
                    {currentRole === role && (
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-action" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Member Avatar */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slateSurface-200">
            <div className="w-8 h-8 rounded-full bg-forest-action/10 border border-forest-action/20 flex items-center justify-center text-forest-action font-semibold text-xs">
              {currentMember?.name ? currentMember.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Visible on < 1024px when hamburger toggled) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-surface border-r border-slateSurface-200 flex flex-col h-full z-50 p-4 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slateSurface-100">
              <div className="font-bold text-sm text-forest flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-forest text-lime-accent flex items-center justify-center text-xs font-black">
                  Ø
                </span>
                LEDGER ZERO
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-brand-700 hover:bg-slateSurface-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-1">
              {mobileNavLinks.map((link) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      isActive ? "bg-brand-50 text-forest-action" : "text-brand-800 hover:bg-slateSurface-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
