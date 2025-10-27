import { RakaminLogo } from "@assets/icon";
import Background from "@components/atoms/background";
import LoadingSpinner, { LoadingDots } from "@components/atoms/loading";
import Image from "next/image";

interface LoadingTemplateProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  variant?: "default" | "minimal" | "dots";
}

export default function LoadingTemplate({
  title = "Loading...",
  subtitle = "Please wait while we prepare your dashboard",
  showLogo = true,
  variant = "default",
}: Readonly<LoadingTemplateProps>) {
  if (variant === "minimal") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner size="lg" text={title} />
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {showLogo && <RakaminLogo />}
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-font-primary text-lg font-semibold">{title}</h2>
            <LoadingDots size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Background>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {/* Logo with pulse animation */}
          {showLogo && (
            <div className="animate-pulse">
              <RakaminLogo />
            </div>
          )}

          {/* Loading Spinner */}
          <div className="relative">
            <div className="border-primary/20 border-t-primary h-16 w-16 animate-spin rounded-full border-4"></div>
          </div>

          {/* Loading Text */}
          <div className="flex flex-col gap-2">
            <h2 className="text-font-primary text-xl font-semibold">{title}</h2>
            <p className="text-font-secondary text-sm">{subtitle}</p>
          </div>

          {/* Loading Dots Animation */}
          <LoadingDots />
        </div>
      </div>
    </Background>
  );
}
