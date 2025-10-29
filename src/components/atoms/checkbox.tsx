"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@utils";

type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  size?: "small" | "medium" | "large";
};

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer focus-visible:ring-ring data-[state=checked]:text-primary-foreground h-8 w-8 shrink-0 rounded-sm border border-[#EFEFEF] bg-white focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#0089CF]",
      className,
      {
        "h-4 w-4": props.size === "small",
        "h-6 w-6": props.size === "medium",
        "h-8 w-8": props.size === "large",
      }
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check
        className={cn({
          "h-3 w-3": props.size === "small",
          "h-5 w-5": props.size === "medium",
          "h-6 w-6": props.size === "large",
        })}
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
