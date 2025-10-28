import { Card } from "@components/atoms/card";

import { cn, formatSalaryRange } from "@utils";
import Image from "next/image";
import { logo_rakamin } from "@assets/images";
import { IJobPosting } from "@interfaces/jobs";
import { LocationIcon } from "@assets/icon";
import MoneyIcon from "@assets/icon/MoneyIcon";
import { useSearchParams, useRouter } from "next/navigation";

type CardJobsProps = Readonly<{
  job: IJobPosting;
}>;

export default function CardListJobs({ job }: CardJobsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobId = searchParams.get("jobId");

  const onClick = () => {
    // Handle card click if needed

    const params = new URLSearchParams(searchParams);
    params.set("jobId", job.id);
    router.push(`?${params.toString()}`);
  };
  return (
    <Card
      className={cn(
        "flex w-full cursor-pointer flex-col items-start gap-4 overflow-hidden rounded-lg border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md",
        job.id === jobId &&
          "border-border-tertiary bg-primary-foreground border-2"
      )}
      onClick={onClick}
    >
      {/* Logo */}
      <div className="flex flex-row gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm border">
          <Image
            src={logo_rakamin}
            alt="Rakamin Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <div className="text-font-natural flex flex-1 flex-col justify-between">
          <h3 className="font-bold">{job.jobName}</h3>
          <p className="text-sm">Rakamin</p>
        </div>
      </div>

      {/* Job Details */}
      <div
        className="flex w-full flex-1 flex-col gap-2 pt-2"
        style={{
          borderTop: "1px dashed #E0E0E0",
          borderImage:
            "repeating-linear-gradient(to right, #E0E0E0 0, #E0E0E0 2px, transparent 2px, transparent 5px) 1",
        }}
      >
        {/* Location and Salary */}
        <div className="text-muted-foreground flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-1">
            <LocationIcon />
            <span>Jakarta Selatan</span>
          </div>
          <div className="flex items-center gap-1">
            <MoneyIcon />
            <span>
              {formatSalaryRange(job.minimumSalary, job.maximumSalary)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
