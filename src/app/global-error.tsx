"use client";

import { RakaminLogo } from "@assets/icon";
import { Button } from "@components/atoms/button";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <main className="flex h-screen flex-col gap-4">
          <section className="flex h-full flex-1 p-4">
            <div className="bg-foreground flex w-full flex-1 rounded-[40px] p-4">
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-8 text-center">
                  {/* Logo */}
                  <RakaminLogo className="h-auto w-32 object-contain opacity-80" />

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
                      Application Error
                    </h1>
                    <p className="text-font-secondary max-w-md text-lg leading-relaxed">
                      A critical error occurred that prevented the application
                      from loading properly. Please try refreshing the page.
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
                      Reload Application
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
