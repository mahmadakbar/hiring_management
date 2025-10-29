"use client";

import { withRoleAccess } from "@components/hoc/withRoleAccess";
import AdminJobDetails from "@components/organisms/JobList/AdminJobDetails";
import React from "react";

function JobDetailsTemplate() {
  return (
    <div className="flex w-full gap-6">
      <AdminJobDetails />
    </div>
  );
}

export default withRoleAccess(JobDetailsTemplate, ["admin"]);
