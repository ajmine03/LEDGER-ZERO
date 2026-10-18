"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, ArrowRight, Shield, Sparkles } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("alex@harborandpine.com");
  const [password, setPassword] = useState("••••••••");

  const handleDemoSignIn = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest text-lime-accent font-black text-2xl flex items-center justify-center mx-auto shadow-sm">
            Ø
          </div>
          <h1 className="text-2xl font-bold text-forest tracking-tight">
            LEDGER ZERO
          </h1>
          <p className="text-xs text-brand-700/70">
            Autonomous AI Financial Operating System by NULL PROTOCOL
          </p>
        </div>

        {/* Demo Fast Entry Banner */}
        <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-forest-action" />
            <span className="font-bold text-forest text-xs">
              Judge & Hackathon Instant Demo Mode
            </span>
          </div>
          <p className="text-[11px] text-brand-800/80 leading-relaxed">
            Jump directly into the pre-seeded workspace for <strong>Harbor & Pine Supply Co.</strong> with cash shortage scenario pre-loaded.
          </p>
          <Button
            variant="lime"
            size="md"
            className="w-full shadow-xs"
            onClick={handleDemoSignIn}
          >
            Launch Demo Workspace
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Traditional Form Card */}
        <Card className="p-6 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDemoSignIn();
            }}
            className="space-y-4 text-xs"
          >
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-brand-900">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-forest-action hover:underline text-[11px]"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full">
              Sign In (Mock Auth)
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-brand-700/70">
            Don't have an account?{" "}
            <Link href="/onboarding" className="font-semibold text-forest-action hover:underline">
              Create New Business
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
