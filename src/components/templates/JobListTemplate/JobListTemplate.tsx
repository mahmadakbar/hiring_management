"use client";

import CardBackground from "@components/molecules/Card/CardBackground";
import { PopupCreateJob } from "@components/molecules/Popup";
import AdminJoblist from "@components/organisms/JobList/AdminJoblist";
import FormCreateJob from "@components/organisms/JobList/AdminJoblist/FormCreateJob";
import { useState } from "react";

export default function JobListTemplate() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCreateJob = () => {
    console.log("Create Job button clicked");
    setIsPopupOpen(true);
  };

  return (
    <div className="flex w-full gap-6">
      <AdminJoblist onCreateJobClick={handleCreateJob} />

      <div className="sticky top-6 self-start">
        <CardBackground onClickButton={handleCreateJob} />
      </div>

      <PopupCreateJob
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
        content={<FormCreateJob onFinish={() => setIsPopupOpen(false)} />}
      />
    </div>
  );
}
