"use client";

import { NotFoundData } from "@components/templates/NotFoundTemplate";
import React, { useEffect } from "react";
import CardListJobs from "@components/molecules/Card/CardJobs";
import { useRouter, useSearchParams } from "next/navigation";
import DetailsJob from "./DetailsJob";
import { useGetJobs } from "@services/query/jobsQuery";
import Loading from "@components/atoms/loading";

export default function CandidateJoblist() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch jobs from Supabase filtered by status "active"
  const { data, isLoading, isError } = useGetJobs({ status: "active" });
  const jobs = data?.jobs || [];

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentJobId = params.get("jobId");

    // Only set the first job if no jobId is selected
    if (jobs && jobs.length > 0 && !currentJobId) {
      params.set("jobId", jobs[0].id);
      router.push(`?${params.toString()}`);
    }
  }, [jobs, router]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full flex-col gap-6">
        <NotFoundData
          showButton={false}
          title="Error Loading Jobs"
          description="Failed to load job listings. Please try again later."
        />
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex w-full flex-col gap-6">
        <NotFoundData
          showButton={false}
          description="Please wait for the next batch of openings."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full gap-1 md:px-10">
      <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pr-4 md:min-w-[400px]">
        {jobs.map(job => (
          <div key={job.id}>
            <CardListJobs job={job} />
          </div>
        ))}
      </div>

      <DetailsJob />
    </div>
  );
}
