import Background from "@components/atoms/background";
import { JobListTemplate } from "@components/templates/JobListTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job List",
};

export default async function JobList() {
  return (
    <Background className="h-full">
      <div className="flex h-full w-full">
        <JobListTemplate />
      </div>
    </Background>
  );
}
