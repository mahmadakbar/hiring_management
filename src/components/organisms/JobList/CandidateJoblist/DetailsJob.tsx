import { logo_rakamin } from "@assets/images";
import { Button } from "@components/atoms/button";
import { NotFoundData } from "@components/templates/NotFoundTemplate";
import { useJobListStore } from "@stores/jobListStore";
import { capitalize } from "@utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function DetailsJob() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { getJobById } = useJobListStore();

  const job = getJobById(searchParams.get("jobId") || "");

  if (!job) {
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
    <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-xl border p-6">
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

        <Button
          onClick={() => router.push("/apply?jobId=" + job.id)}
          className="rounded-xl px-4 py-1 text-sm"
        >
          Apply
        </Button>
      </div>
      <div className="mt-4">
        <p>{job.jobDescription}</p>
      </div>
    </div>
  );
}
