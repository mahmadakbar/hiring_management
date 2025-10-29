"use client";

import CardBackground from "@components/molecules/Card/CardBackground";
import { PopupCreateJob } from "@components/molecules/Popup";
import AdminJoblist from "@components/organisms/JobList/AdminJoblist";
import FormCreateJob from "@components/organisms/JobList/AdminJoblist/FormCreateJob";
import CandidateJoblist from "@components/organisms/JobList/CandidateJoblist";
import { RoleGuard } from "@/components/hoc";
import { useState } from "react";

export default function JobListTemplate() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(
    undefined
  );

  const handleCreateJob = (id?: string) => {
    console.log("Create Job button clicked");
    setIsPopupOpen(true);
    setSelectedJobId(id);
  };

  return (
    <div className="flex h-full w-full gap-6">
      {/* Candidate view - only visible to users with "user" role */}
      <RoleGuard allowedRoles={["user"]}>
        <CandidateJoblist />
      </RoleGuard>

      {/* Admin view - only visible to users with "admin" role */}
      <RoleGuard allowedRoles={["admin"]}>
        <div className="flex h-full w-full gap-6">
          <AdminJoblist onCreateJobClick={handleCreateJob} />

          <div className="sticky top-6 self-start">
            <CardBackground onClickButton={handleCreateJob} />
          </div>

          <PopupCreateJob
            open={isPopupOpen}
            onOpenChange={setIsPopupOpen}
            content={
              <FormCreateJob
                jobId={selectedJobId}
                onFinish={() => {
                  setIsPopupOpen(false);
                  setSelectedJobId(undefined);
                }}
              />
            }
          />
        </div>
      </RoleGuard>
    </div>
  );
}
