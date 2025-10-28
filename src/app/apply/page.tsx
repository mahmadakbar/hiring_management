import Background from "@components/atoms/background";
import { JobApplyTemplate } from "@components/templates/JobListTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply Job",
};

export default function ApplyJob() {
  return (
    <Background>
      <div className="flex h-full w-full">
        <JobApplyTemplate />
      </div>
    </Background>
  );
}
