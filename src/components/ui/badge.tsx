import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "risk"
    | "lime"
    | "outline"
    | "simulated";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full border select-none transition-colors";

  const variantStyles = {
    default: "bg-slateSurface-100 text-brand-900 border-slateSurface-200",
    success: "bg-success-50 text-success-700 border-success-200",
    warning: "bg-warning-50 text-warning-700 border-warning-200",
    risk: "bg-risk-50 text-risk-700 border-risk-200",
    lime: "bg-lime-accent/40 text-brand-900 border-lime-accent",
    outline: "bg-transparent text-brand-800 border-slateSurface-300",
    simulated: "bg-amber-100/70 text-amber-900 border-amber-300 font-semibold tracking-wide",
  };

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    md: "text-xs px-2.5 py-0.5 gap-1.5",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {variant === "simulated" && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      )}
      {children}
    </span>
  );
}
