"use client";

import { Button } from "@components/atoms/button";
import Background from "@components/atoms/background";

import Image, { StaticImageData } from "next/image";
import { img_empty } from "@assets/images";

type NotFoundDataProps = Readonly<{
  imageSrc?: StaticImageData;
  title?: string;
  description?: string;
  showButton?: boolean;
  onCreateJob?: () => void;
}>;

export default function NotFoundData({
  imageSrc = img_empty,
  title = "No job openings available",
  description = "Create a job opening now and start the candidate process.",
  showButton = true,
  onCreateJob,
}: NotFoundDataProps) {
  return (
    <Background>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Image
            src={imageSrc}
            alt="Empty Data Illustration"
            className="w-64 md:w-80"
          />

          {/* Main Message */}
          <div className="flex flex-col gap-2">
            <h1 className="text-font-natural text-xl leading-tight font-bold">
              {title}
            </h1>
            <p className="text-font-natural max-w-md text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          {showButton && (
            <div className="flex">
              <Button
                variant="default"
                className="px-4"
                onClick={e => {
                  e.stopPropagation();
                  onCreateJob?.();
                }}
              >
                Create New Job
              </Button>
            </div>
          )}
        </div>
      </div>
    </Background>
  );
}
