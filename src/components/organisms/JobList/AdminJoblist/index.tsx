import { NotFoundData } from "@components/templates/NotFoundTemplate";
import React from "react";
import { Icon } from "@iconify/react";
import { Input } from "@components/atoms/input";
import { useJobListStore } from "@stores/jobListStore";
import CardListJobs from "@components/molecules/Card/CardListJobs";
import { useRouter } from "next/navigation";

type AdminJoblistProps = Readonly<{
  onCreateJobClick?: () => void;
}>;

export default function AdminJoblist({ onCreateJobClick }: AdminJoblistProps) {
  const router = useRouter();
  const { jobs } = useJobListStore();

  const formatSalaryRange = (
    minSalary?: number | null,
    maxSalary?: number | null
  ) => {
    if (!minSalary && !maxSalary) return "Salary not specified";

    const formatCurrency = (value: number) => {
      return `Rp${value.toLocaleString("id-ID")}`;
    };

    if (minSalary && maxSalary) {
      return `${formatCurrency(minSalary)} - ${formatCurrency(maxSalary)}`;
    }

    if (minSalary) return `From ${formatCurrency(minSalary)}`;
    if (maxSalary) return `Up to ${formatCurrency(maxSalary)}`;

    return "Salary not specified";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  console.log("Jobs:", jobs);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex w-full items-center">
        <Input
          type="text"
          placeholder={"Search by job details"}
          // onChange={e => handleSearchChange(e.target.value)}
          className="w-full pr-12 text-sm"
        />
        <Icon icon="mynaui:search" className="text-secondary -ml-9 text-2xl" />
      </div>

      {jobs.length > 0 ? (
        <div className="mt-6 flex flex-col gap-4 pb-8">
          {jobs.map(job => (
            <CardListJobs
              key={job.id}
              jobTitle={job.jobName}
              salaryRange={formatSalaryRange(
                job.minimumSalary,
                job.maximumSalary
              )}
              status={job.status}
              startedDate={formatDate(job.createdAt)}
              onManageClick={() => {
                router.push(`/job-list/${job.id}`);
              }}
            />
          ))}
        </div>
      ) : (
        <NotFoundData onCreateJob={onCreateJobClick} />
      )}
    </div>
  );
}
