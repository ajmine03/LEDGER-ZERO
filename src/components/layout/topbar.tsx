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
} from "lucide-react";
import { Role } from "@/domain/types";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const {
    business,
    currentMember,
    currentRole,
    countryConfig,
    switchRole,
    switchCountryPreset,
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLocaleDropdown, setShowLocaleDropdown] = useState(false);

  const availableRoles: Role[] = ["Owner", "Admin", "Accountant", "Viewer"];

  const localePresets = [
    { code: "US", label: "USD - United States ($)", flag: "🇺🇸" },
    { code: "EU", label: "EUR - European Union (€)", flag: "🇪🇺" },
    { code: "BD", label: "BDT - Bangladesh (৳)", flag: "🇧🇩" },
    { code: "GB", label: "GBP - United Kingdom (£)", flag: "🇬🇧" },
    { code: "IN", label: "INR - India (₹)", flag: "🇮🇳" },
  ];

  return (
    <header className="h-16 bg-surface border-b border-slateSurface-200 px-6 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left: Business entity indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slateSurface-100 border border-slateSurface-200/80">
          <Building className="w-4 h-4 text-forest-action" />
          <span className="text-sm font-semibold text-brand-900">
            {business?.name || "Harbor & Pine Supply Co."}
          </span>
          <Badge variant="outline" size="sm" className="hidden sm:inline-flex text-[10px]">
            Active Workspace
          </Badge>
        </div>
      </div>

      {/* Middle: Quick search bar */}
      <div className="hidden md:flex items-center relative w-72 max-w-md">
        <Search className="w-4 h-4 text-brand-700/50 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search invoices, counterparties, logs..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slateSurface-100 border border-slateSurface-200 rounded-lg text-brand-900 focus:outline-none focus:ring-1 focus:ring-forest-action placeholder:text-brand-700/40"
        />
      </div>

      {/* Right: Controls & Judge Switchers */}
      <div className="flex items-center gap-3">
        {/* Country / Currency Preset Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLocaleDropdown(!showLocaleDropdown);
              setShowRoleDropdown(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slateSurface-100 hover:bg-slateSurface-200 text-xs font-medium text-brand-900 border border-slateSurface-200 transition-colors"
            title="Switch Locale & Currency Preset"
          >
            <Globe className="w-3.5 h-3.5 text-brand-700" />
            <span className="font-mono font-semibold">{countryConfig.defaultCurrency}</span>
            <ChevronDown className="w-3 h-3 text-brand-700/60" />
          </button>

          {showLocaleDropdown && (
            <div className="absolute right-0 top-10 w-60 bg-white rounded-xl shadow-dropdown border border-slateSurface-200 py-1 z-30 animate-in fade-in duration-100">
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-forest text-white hover:bg-forest-light text-xs font-medium transition-colors shadow-xs"
            title="Switch Team Role (Judge Test Feature)"
          >
            <Shield className="w-3.5 h-3.5 text-lime-accent" />
            <span className="font-semibold">{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-white/70" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-dropdown border border-slateSurface-200 py-1 z-30 animate-in fade-in duration-100">
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
        <div className="flex items-center gap-2 pl-2 border-l border-slateSurface-200">
          <div className="w-8 h-8 rounded-full bg-forest-action/10 border border-forest-action/20 flex items-center justify-center text-forest-action font-semibold text-xs">
            {currentMember?.name ? currentMember.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-brand-900 leading-tight">
              {currentMember?.name || "Alex Vance"}
            </div>
            <div className="text-[10px] text-brand-700/60 leading-tight">
              {currentRole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
