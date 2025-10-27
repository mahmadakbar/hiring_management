import * as React from "react";
import Link from "next/link";

import { cn } from "@utils";

interface BaseCardProps {
  className?: string;
  href?: string;
  asButton?: boolean;
  target?: string;
  disabled?: boolean;
}

type CardProps = BaseCardProps &
  (
    | (React.HTMLAttributes<HTMLDivElement> & {
        href?: never;
        asButton?: never;
      })
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never;
        asButton: true;
      })
    | (React.HTMLAttributes<HTMLDivElement> & {
        href: string;
        asButton?: never;
      })
  );

const Card = React.forwardRef<HTMLDivElement | HTMLButtonElement, CardProps>(
  ({ className, href, asButton, target, disabled, ...props }, ref) => {
    const baseClasses = cn(
      "bg-card text-card-foreground rounded-xl border shadow",
      {
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95":
          (href || asButton) && !disabled,
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2":
          (href || asButton) && !disabled,
        "opacity-50 cursor-not-allowed": disabled,
      },
      className
    );

    if (href && !disabled) {
      return (
        <Link href={href} target={target} className="block">
          <div
            ref={ref as React.Ref<HTMLDivElement>}
            className={baseClasses}
            {...(props as React.HTMLAttributes<HTMLDivElement>)}
          />
        </Link>
      );
    }

    if (href && disabled) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={baseClasses}
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        />
      );
    }

    if (asButton) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={baseClasses}
          disabled={disabled}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        />
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={baseClasses}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("leading-none font-semibold tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
