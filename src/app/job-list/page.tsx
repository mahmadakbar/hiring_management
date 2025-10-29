import Background from "@components/atoms/background";
import { JobListTemplate } from "@components/templates/JobListTemplate";
import { createClient } from "@lib/superbase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job List",
};

export default async function JobList() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from("instruments").select();

  console.log("INSTRUMENTS:", instruments);
  return (
    <Background>
      <div className="flex h-full w-full">
        <JobListTemplate />
      </div>
    </Background>
  );
}
