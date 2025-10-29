import { NotFoundData } from "@components/templates/NotFoundTemplate";
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Input } from "@components/atoms/input";
import { useGetJobs } from "@services/query/jobsQuery";
import CardListJobs from "@components/molecules/Card/CardListJobs";
import { useRouter, useSearchParams } from "next/navigation";
import { formatSalaryRange } from "@utils";
import LoadingSpinner from "@components/atoms/loading";
import InputSearch from "@components/atoms/input-search";

type AdminJoblistProps = Readonly<{
  onCreateJobClick?: (id?: string) => void;
}>;

export default function AdminJoblist({ onCreateJobClick }: AdminJoblistProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch jobs from API using React Query
  const { data, isLoading, isError, error } = useGetJobs({
    search: searchQuery,
  });
  const jobs = data?.jobs || [];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debouncing
    debounceTimerRef.current = setTimeout(() => {
      setSearchQuery(value);

      // Update URL parameters
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      // Update URL without page reload
      const newUrl = params.toString()
        ? `?${params.toString()}`
        : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }, 500); // Wait 500ms after user stops typing
  };

  console.log("Jobs:", jobs);
  return (
    <div className="flex flex-1 flex-col">
      <InputSearch
        searchInput={searchInput}
        handleSearchChange={handleSearchChange}
      />
      {/* Handle loading state */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        // Handle error state
        <div className="flex flex-1 items-center justify-center">
          <p className="text-red-500">
            Error loading jobs: {error?.message || "Unknown error"}
          </p>
        </div>
      ) : jobs.length > 0 ? (
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
              onClick={() => onCreateJobClick?.(job.id)}
            />
          ))}
        </div>
      ) : (
        <NotFoundData onCreateJob={onCreateJobClick} />
      )}
    </div>
  );
}
