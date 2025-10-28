import Background from "@components/atoms/background";
import { JobDetailsTemplate } from "@components/templates/JobListTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Candidate",
};

export default function JobDetails() {
  return (
    <Background>
      <div className="flex h-full w-full">
        <JobDetailsTemplate />
      </div>
    </Background>
  );
}
