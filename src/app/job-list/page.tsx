import Background from "@components/atoms/background";
import { JobListTemplate } from "@components/templates/JobListTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job List",
};

export default function JobList() {
  return (
    <Background>
      <div className="flex h-full w-full">
        <JobListTemplate />
      </div>
    </Background>
  );
}
