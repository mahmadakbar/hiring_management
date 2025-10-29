"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface Step {
  label: string;
  status: "completed" | "current" | "pending" | "rejected";
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        {/* Circles and Line Container */}
        <div className="relative flex items-center justify-between">
          {/* Background Line - Behind circles */}
          <div className="absolute top-5 right-0 left-0 h-0.5 bg-gray-300" />

          {/* Progress Line - Behind circles */}
          <div
            className="absolute top-5 left-0 h-0.5 bg-green-500 transition-all duration-500"
            style={{
              width: `${(steps.filter(s => s.status === "completed").length / (steps.length - 1)) * 100}%`,
            }}
          />

          {/* Steps with circles and labels */}
          {steps.map((step, index) => (
            <div
              key={`step-${index}`}
              className="relative flex flex-col items-center gap-3"
            >
              {/* Step Circle */}
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 bg-white transition-all",
                  step.status === "completed" &&
                    "border-green-500 bg-green-500",
                  step.status === "current" &&
                    "animate-pulse border-green-500 bg-white shadow-lg",
                  step.status === "pending" && "border-gray-300 bg-white",
                  step.status === "rejected" && "border-gray-400 bg-gray-400"
                )}
              >
                {step.status === "completed" && (
                  <Check className="h-5 w-5 text-white" strokeWidth={3} />
                )}
                {step.status === "current" && (
                  <Check className="h-5 w-5 text-green-500" strokeWidth={3} />
                )}
                {step.status === "rejected" && (
                  <X className="h-5 w-5 text-white" strokeWidth={3} />
                )}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "h-10 max-w-20 text-center text-xs leading-tight font-medium",
                  step.status === "completed" && "text-gray-600",
                  step.status === "current" && "font-semibold text-gray-800",
                  step.status === "pending" && "text-gray-400",
                  step.status === "rejected" && "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
