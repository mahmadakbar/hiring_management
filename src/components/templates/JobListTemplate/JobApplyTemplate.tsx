"use client";

import FormApplyJob from "@components/organisms/JobList/CandidateJoblist/FormApplyJob";
import { useJobListStore } from "@stores/jobListStore";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { NotFoundPage } from "../NotFoundTemplate";
import { Button } from "@components/atoms/button";
import { Icon } from "@iconify/react";
import { withRoleAccess } from "@/components/hoc";
import LoadingSpinner from "@components/atoms/loading";
import { useGetJobById } from "@services/query/jobsQuery";

function JobApplyTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobId = searchParams.get("jobId") || "";

  // Fetch job details from Supabase
  const { data, isLoading, isError } = useGetJobById(jobId, !!jobId);
  const job = data?.job;

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl border p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !job) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-full w-full rounded-lg bg-white md:max-h-[calc(100vh-70px)] md:max-w-[700px]">
        <div className="flex gap-4 rounded-t-lg border border-b-0 px-10 pt-10 pb-4">
          <div className="flex flex-1 gap-4">
            <Button
              variant={"outline"}
              className="hover:text-font-natural mt-1 h-fit bg-white p-1 shadow-none hover:bg-gray-100 hover:shadow-sm"
              onClick={() => router.back()}
            >
              <Icon icon="iconamoon:arrow-left-1" fontSize={28} />
            </Button>
            <h2 className="text-lg font-bold">
              Apply for {job?.jobName} at Rakamin
            </h2>
          </div>

          <h3 className="text-font-natural mt-1 text-sm">
            ℹ️ This field required to fill
          </h3>
        </div>

        <FormApplyJob
          jobId={jobId}
          mandatoryFields={job.minimumProfileInformation}
        />
      </div>
    </div>
  );
}

export default withRoleAccess(JobApplyTemplate, ["user"]);
