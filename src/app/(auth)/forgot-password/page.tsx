"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest text-lime-accent font-black text-2xl flex items-center justify-center mx-auto shadow-sm">
            Ø
          </div>
          <h1 className="text-2xl font-bold text-forest tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-brand-700/70">
            Enter your work email to receive password reset instructions
          </p>
        </div>

        <Card className="p-6 space-y-4 text-xs">
          {submitted ? (
            <div className="p-4 bg-success-50 border border-success-200 rounded-xl space-y-2 text-center">
              <CheckCircle2 className="w-6 h-6 text-success-600 mx-auto" />
              <p className="font-semibold text-success-800">
                Logged in-app (simulated delivery)
              </p>
              <p className="text-success-900/80 text-[11px]">
                Reset link logged to in-memory store for <strong>{email}</strong>.
              </p>
              <div className="pt-2">
                <Link href="/sign-in">
                  <Button variant="outline" size="sm">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Work Email"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" size="md" className="w-full">
                Send Reset Link (Simulated)
              </Button>
            </form>
          )}

          {!submitted && (
            <div className="pt-2 text-center text-xs text-brand-700/70">
              <Link href="/sign-in" className="font-semibold text-forest-action hover:underline">
                Back to Sign In
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
