"use client";

import { NotFoundData } from "@components/templates/NotFoundTemplate";
import { useJobListStore } from "@stores/jobListStore";
import React, { useEffect } from "react";
import CardListJobs from "@components/molecules/Card/CardJobs";
import { useRouter, useSearchParams } from "next/navigation";
import DetailsJob from "./DetailsJob";

export default function CandidateJoblist() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { jobs } = useJobListStore();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (jobs && jobs.length > 0) {
      params.set("jobId", jobs[0].id);
      router.push(`?${params.toString()}`);
    }
  }, [jobs]);

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
    <div className="flex w-full gap-1 pb-8 md:px-10">
      <div className="flex flex-col gap-4 overflow-y-auto pr-4 md:min-w-[400px]">
        {jobs
          .filter(job => job.status === "active")
          .map(job => (
            <CardListJobs key={job.id} job={job} />
          ))}
      </div>

      <DetailsJob />
    </div>
  );
}
