import {
  NotFoundData,
  NotFoundPage,
} from "@components/templates/NotFoundTemplate";
import React from "react";
import { Icon } from "@iconify/react";
import { Input } from "@components/atoms/input";
import { useJobListStore } from "@stores/jobListStore";
import CardListJobs from "@components/molecules/Card/CardListJobs";
import { useParams, useRouter } from "next/navigation";
import { img_no_data } from "@assets/images";

export default function AdminJobDetails() {
  const router = useRouter();
  const params = useParams();

  const { getJobById } = useJobListStore();

  if (!params?.id) {
    return <NotFoundPage />;
  }
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;
  const job = getJobById(jobId);

  if (!job) {
    return <NotFoundPage />;
  }

  console.log("Job ID from params:", job);

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-lg font-bold">{job?.jobName}</h1>

      <NotFoundData
        imageSrc={img_no_data}
        title="No candidates found"
        description="Share your job vacancies so that more candidates will apply."
        showButton={false}
      />
    </div>
  );
}
