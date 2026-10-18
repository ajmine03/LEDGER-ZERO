"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Business, Member, Role, ROLE_PERMISSIONS, PermissionMatrix } from "@/domain/types";
import { CountryConfig, COUNTRY_CONFIGS, getCountryConfig } from "@/domain/countries";
import { dataService, authService } from "@/services";

interface AppContextType {
  business: Business | null;
  currentMember: Member | null;
  currentRole: Role;
  permissions: PermissionMatrix;
  countryConfig: CountryConfig;
  activeCurrency: string;
  isSimulatedDemo: boolean;
  refreshData: () => Promise<void>;
  switchRole: (role: Role) => Promise<void>;
  switchCountryPreset: (countryCode: string) => Promise<void>;
  resetDemo: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [currentRole, setCurrentRole] = useState<Role>("Owner");
  const [countryConfig, setCountryConfig] = useState<CountryConfig>(COUNTRY_CONFIGS.US);

  const loadAppState = useCallback(async () => {
    try {
      const [biz, member] = await Promise.all([
        dataService.getBusiness(),
        authService.getCurrentMember(),
      ]);
      setBusiness(biz);
      setCurrentMember(member);
      setCurrentRole(member.role);
      setCountryConfig(getCountryConfig(biz.countryCode));
    } catch (err) {
      console.error("Failed to load initial app context:", err);
    }
  }, []);

  useEffect(() => {
    loadAppState();
  }, [loadAppState]);

  const switchRole = async (newRole: Role) => {
    try {
      const updated = await authService.switchRole(newRole);
      setCurrentRole(updated.role);
      setCurrentMember(updated);
    } catch (err) {
      console.error("Error switching role:", err);
    }
  };

  const switchCountryPreset = async (countryCode: string) => {
    const config = getCountryConfig(countryCode);
    setCountryConfig(config);
    if (business) {
      const updatedBiz = await dataService.updateBusiness({
        countryCode: config.code,
        currency: config.defaultCurrency,
        taxLabel: config.taxLabel,
        taxRatePercent: config.defaultTaxRatePercent,
        timeZone: config.timeZone,
      });
      setBusiness(updatedBiz);
    }
  };

  const resetDemo = async () => {
    await dataService.resetDemoData();
    await loadAppState();
  };

  const permissions = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.Viewer;

  return (
    <AppContext.Provider
      value={{
        business,
        currentMember,
        currentRole,
        permissions,
        countryConfig,
        activeCurrency: countryConfig.defaultCurrency,
        isSimulatedDemo: true,
        refreshData: loadAppState,
        switchRole,
        switchCountryPreset,
        resetDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
