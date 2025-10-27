"use client";

import { Button } from "@components/atoms/button";
import Background from "@components/atoms/background";
import { useEffect } from "react";
import { RakaminLogo } from "@assets/icon";

type ErrorPageProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Background>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {/* Logo */}
          <RakaminLogo />

          {/* Error Icon */}
          <div className="bg-destructive/10 flex h-24 w-24 items-center justify-center rounded-full">
            <svg
              className="text-destructive h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Main Message */}
          <div className="flex flex-col gap-4">
            <h1 className="text-font-primary text-3xl leading-tight font-semibold md:text-4xl">
              Something went wrong!
            </h1>
            <p className="text-font-secondary max-w-md text-lg leading-relaxed">
              We encountered an unexpected error while processing your request.
              Don&apos;t worry, our team has been notified and is working on a
              fix.
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="bg-muted mt-4 max-w-lg rounded-lg p-4 text-left">
                <summary className="text-font-primary cursor-pointer text-sm font-medium">
                  Error Details (Development Only)
                </summary>
                <pre className="text-font-secondary mt-2 overflow-auto text-xs">
                  {error.message}
                </pre>
              </details>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Button
              variant="default"
              className="h-auto rounded-full px-6 py-3 text-sm font-medium"
              onClick={() => reset()}
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              className="border-font-secondary text-font-secondary hover:bg-font-secondary/10 h-auto rounded-full px-6 py-3 text-sm font-medium"
              onClick={() => (window.location.href = "/")}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Background>
  );
}
