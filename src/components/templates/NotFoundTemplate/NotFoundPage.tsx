"use client";

import { Button } from "@components/atoms/button";
import Background from "@components/atoms/background";

import Link from "next/link";
import { RakaminLogo } from "@assets/icon";

export default function NotFoundPage() {
  return (
    <Background>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {/* Logo */}
          <RakaminLogo />

          {/* 404 Number */}
          <div className="text-font-primary text-8xl font-bold opacity-20 md:text-9xl">
            404
          </div>

          {/* Main Message */}
          <div className="flex flex-col gap-4">
            <h1 className="text-font-primary text-3xl leading-tight font-semibold md:text-4xl">
              Page Not Found
            </h1>
            <p className="text-font-secondary max-w-md text-lg leading-relaxed">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. The
              page might have been moved, deleted, or doesn&apos;t exist.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link href="/">
              <Button
                variant="default"
                className="h-auto rounded-full px-6 py-3 text-sm font-medium"
              >
                Go to Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-font-secondary text-font-secondary hover:bg-font-secondary/10 h-auto rounded-full px-6 py-3 text-sm font-medium"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Background>
  );
}
