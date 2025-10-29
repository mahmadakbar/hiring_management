import {
  NotFoundData,
  NotFoundPage,
} from "@components/templates/NotFoundTemplate";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Input } from "@components/atoms/input";
import {
  ApplicantsTable,
  Applicant,
  ColumnConfig,
} from "@components/molecules/Table";
import CardListJobs from "@components/molecules/Card/CardListJobs";
import { useParams, useRouter } from "next/navigation";
import { img_no_data } from "@assets/images";
import { useGetJobById } from "@services/query/jobsQuery";
import { useGetJobApplicants } from "@services/query/applyQuery";
import Loading from "@components/atoms/loading";
import ApplicantProfileDialog from "@components/molecules/Popup/ApplicantProfileDialog";

export default function AdminJobDetails() {
  const router = useRouter();
  const params = useParams();
  const [selectedApplicants, setSelectedApplicants] = useState<
    Set<number | string>
  >(new Set());
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Define columns configuration
  const columns: ColumnConfig<Applicant>[] = [
    {
      key: "fullName",
      label: "NAMA LENGKAP",
    },
    {
      key: "email",
      label: "EMAIL ADDRESS",
    },
    {
      key: "phoneNumber",
      label: "PHONE NUMBERS",
      render: (value: string, row: any) => {
        return value ? `${row.countryCode || "+62"} ${value}` : "-";
      },
    },
    {
      key: "dateOfBirth",
      label: "DATE OF BIRTH",
      render: (value: string) => {
        if (!value) return "-";
        const date = new Date(value);
        return date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      },
    },
    {
      key: "domicile",
      label: "DOMICILE",
      render: (value: string) => value || "-",
    },
    {
      key: "gender",
      label: "GENDER",
      render: (value: string) => value || "-",
    },
    {
      key: "linkedinLink",
      label: "LINK LINKEDIN",
      render: (value: string) => {
        if (!value) return "-";
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline"
          >
            {value}
          </a>
        );
      },
    },
  ];

  if (!params?.id) {
    return <NotFoundPage />;
  }

  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, isLoading, isError, error } = useGetJobById(jobId);
  const {
    data: applicantsData,
    isLoading: isLoadingApplicants,
    isError: isErrorApplicants,
  } = useGetJobApplicants(jobId);

  if (isLoading || isLoadingApplicants) {
    return (
      <div className="flex h-screen w-full flex-1 flex-col gap-4 rounded-xl border p-6">
        <Loading />;
      </div>
    );
  }

  if (isError || !data?.job) {
    return <NotFoundPage />;
  }

  const job = data.job;
  const applicants = applicantsData?.applicants || [];

  console.log("Job data from Supabase:", job);
  console.log("Applicants data from Supabase:", applicants);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplicants(new Set(applicants.map((a: Applicant) => a.id)));
    } else {
      setSelectedApplicants(new Set());
    }
  };

  const handleSelectApplicant = (id: number | string, checked: boolean) => {
    const newSelected = new Set(selectedApplicants);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedApplicants(newSelected);
  };

  const handleRowClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-lg font-bold">{job?.jobName}</h1>

      {applicants.length === 0 ? (
        <NotFoundData
          imageSrc={img_no_data}
          title="No candidates found"
          description="Share your job vacancies so that more candidates will apply."
          showButton={false}
        />
      ) : (
        <div className="flex rounded-lg border bg-white p-6">
          <ApplicantsTable
            data={applicants}
            columns={columns}
            selectable={true}
            selectedRows={selectedApplicants}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectApplicant}
            onRowClick={handleRowClick}
          />
        </div>
      )}

      <ApplicantProfileDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        applicant={selectedApplicant}
      />
    </div>
  );
}
