import { cn } from "@utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  showText?: boolean;
  color?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-16 w-16 border-4",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export default function LoadingSpinner({
  size = "md",
  className,
  text = "Loading...",
  showText = true,
  color,
}: Readonly<LoadingSpinnerProps>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      {/* Spinner */}
      <div className="relative">
        <div
          className={cn(
            "border-primary/20 border-t-primary animate-spin rounded-full",
            sizeClasses[size],
            color && `border-${color}/20 border-t-${color}`
          )}
        ></div>
      </div>

      {/* Loading Text */}
      {showText && (
        <p className={cn("text-font-secondary", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
}

// Dots loading animation component
interface LoadingDotsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const dotSizeClasses = {
  sm: "h-1 w-1",
  md: "h-2 w-2",
  lg: "h-3 w-3",
};

export function LoadingDots({
  className,
  size = "md",
}: Readonly<LoadingDotsProps>) {
  return (
    <div className={cn("flex gap-1", className)}>
      <div
        className={cn(
          "bg-primary animate-bounce rounded-full [animation-delay:-0.3s]",
          dotSizeClasses[size]
        )}
      ></div>
      <div
        className={cn(
          "bg-primary animate-bounce rounded-full [animation-delay:-0.15s]",
          dotSizeClasses[size]
        )}
      ></div>
      <div
        className={cn(
          "bg-primary animate-bounce rounded-full",
          dotSizeClasses[size]
        )}
      ></div>
    </div>
  );
}

// Skeleton loading component
interface SkeletonProps {
  className?: string;
  rows?: number;
}

export function Skeleton({ className, rows = 1 }: Readonly<SkeletonProps>) {
  const skeletonRows = Array.from({ length: rows }, (_, i) => ({
    id: `skeleton-row-${i}`,
    width: `${Math.random() * 40 + 60}%`,
  }));

  return (
    <div className={cn("space-y-2", className)}>
      {skeletonRows.map(row => (
        <div
          key={row.id}
          className="bg-muted h-4 animate-pulse rounded"
          style={{
            width: row.width,
          }}
        ></div>
      ))}
    </div>
  );
}
