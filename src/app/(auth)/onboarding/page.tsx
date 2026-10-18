"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { COUNTRY_CONFIGS } from "@/domain/countries";
import { Globe, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { switchCountryPreset } = useApp();

  const [step, setStep] = useState(1);
  const [bizName, setBizName] = useState("Harbor & Pine Supply Co.");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [openingCashStr, setOpeningCashStr] = useState("20000.00");

  const handleComplete = async () => {
    await switchCountryPreset(selectedCountry);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest text-lime-accent font-black text-2xl flex items-center justify-center mx-auto shadow-sm">
            Ø
          </div>
          <h1 className="text-2xl font-bold text-forest tracking-tight">
            Configure Your Business Operating System
          </h1>
          <p className="text-xs text-brand-700/70">
            Market-agnostic architecture: adapt LEDGER ZERO to any country, currency, or tax code.
          </p>
        </div>

        <Card className="p-6 space-y-6 text-xs">
          <div className="space-y-4">
            <Input
              label="Business Entity Name"
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              placeholder="e.g. Harbor & Pine Supply Co."
              required
            />

            <div>
              <label className="font-semibold text-brand-900 block mb-1.5">
                Country & Jurisdiction Pack
              </label>
              <Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                options={Object.values(COUNTRY_CONFIGS).map((c) => ({
                  value: c.code,
                  label: `${c.name} (${c.defaultCurrency} - ${c.currencySymbol})`,
                }))}
              />
              <p className="text-[11px] text-brand-700/60 mt-1">
                Sets default ISO currency, minor unit precision (0, 2, or 3 decimals), and tax conventions.
              </p>
            </div>

            <Input
              label="Starting Cash Position (Opening Balance)"
              type="number"
              step="0.01"
              value={openingCashStr}
              onChange={(e) => setOpeningCashStr(e.target.value)}
              placeholder="e.g. 20000.00"
            />
          </div>

          <div className="pt-4 border-t border-slateSurface-100 flex items-center justify-between">
            <button
              onClick={() => router.push("/sign-in")}
              className="text-xs text-brand-700/70 hover:underline"
            >
              Back to Sign In
            </button>

            <Button variant="primary" size="md" onClick={handleComplete}>
              Initialize Operating System
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
