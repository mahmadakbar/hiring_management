import { logo_rakamin } from "@assets/images";
import { Button } from "@components/atoms/button";
import { NotFoundData } from "@components/templates/NotFoundTemplate";
import {
  useGetJobById,
  useCheckUserApplication,
} from "@services/query/jobsQuery";
import { capitalize } from "@utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Loading from "@components/atoms/loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/atoms/popover";
import { Stepper } from "@components/atoms/stepper";

export default function DetailsJob() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobId = searchParams.get("jobId") || "";

  // Fetch job details from Supabase
  const { data, isLoading, isError } = useGetJobById(jobId, !!jobId);
  const job = data?.job;

  // Check if user has already applied to this job
  const { data: applicationStatus, isLoading: isCheckingApplication } =
    useCheckUserApplication(jobId, !!jobId);
  const hasApplied = applicationStatus?.hasApplied || false;

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl border p-6">
        <Loading />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl border p-6">
        <NotFoundData
          showButton={false}
          title="No Job Selected"
          description="Please select a job to see the details."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto rounded-xl border bg-white p-6">
      <div className="flex flex-row gap-4 border-b pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm border">
          <Image
            src={logo_rakamin}
            alt="Rakamin Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <div className="text-font-natural flex flex-1 flex-col justify-between gap-1">
          <div className="bg-accent mb-1 w-fit rounded-sm px-2 py-1 text-xs font-bold text-white">
            {capitalize(job.jobType)}
          </div>
          <h3 className="text-font-natural text-xl font-bold">{job.jobName}</h3>
          <p className="text-font-inverse text-sm">Rakamin</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            onClick={() => router.push("/apply?jobId=" + job.id)}
            className="rounded-xl px-4 py-1 text-sm"
            // disabled={hasApplied || isCheckingApplication}
          >
            {isCheckingApplication
              ? "Checking..."
              : hasApplied
                ? "Applied"
                : "Apply"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="mt-4">
          <p>{job.jobDescription}</p>
        </div>

        {/* Application Progress Stepper */}
        {hasApplied && (
          <div className="mt-8 space-y-4 rounded-lg border bg-white p-6">
            <h3 className="mb-6 text-lg font-bold text-gray-800">
              Application Progress
            </h3>
            <Stepper
              steps={[
                { label: "Application Submitted", status: "completed" },
                { label: "Screening", status: "current" },
                { label: "Interview Scheduled", status: "pending" },
                { label: "Technical Interview", status: "pending" },
                { label: "Offering Letter", status: "pending" },
                { label: "Hired", status: "pending" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
