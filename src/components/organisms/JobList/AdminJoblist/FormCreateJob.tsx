import { zodResolver } from "@hookform/resolvers/zod";
import { FormJobOpeningData } from "@interfaces/forms";
import jobOpeningSchema from "@lib/schema/jobFormSchema";
import React, { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Form } from "@components/atoms/form";
import {
  FormInput,
  FormDropDown,
  FormProfileRequirement,
} from "@components/molecules/Form";
import { Button } from "@components/atoms/button";
import { Switch } from "@components/atoms/switch";
import { Label } from "@components/atoms/label";
import { jobTypeOptions, profileInfo } from "./listData";
import { useCreateJob, useUpdateJob } from "@services/mutation/jobsMutation";
import { useGetJobById } from "@services/query/jobsQuery";
import LoadingSpinner from "@components/atoms/loading";
import { toast } from "@components/atoms/sonner";
import { SaveIcon } from "lucide-react";
import { formatMoneyInput, indonesianCities } from "@utils";

type FormCreateJobProps = Readonly<{
  jobId?: string;
  onFinish?: () => void;
}>;

export default function FormCreateJob({ jobId, onFinish }: FormCreateJobProps) {
  const [isActive, setIsActive] = React.useState(true);

  // API hooks
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const { data: jobData, isLoading: isLoadingJob } = useGetJobById(
    jobId || "",
    !!jobId
  );

  const form = useForm<FormJobOpeningData>({
    resolver: zodResolver(jobOpeningSchema) as any,
    defaultValues: {
      jobName: "",
      jobType: "",
      jobDescription: "",
      numberOfCandidatesNeeded: undefined,
      minimumSalary: null,
      maximumSalary: null,
      location: "",
      minimumProfileInformation: {
        fullName: "mandatory",
        photoProfile: "mandatory",
        gender: "mandatory",
        domicile: "mandatory",
        email: "mandatory",
        phoneNumber: "mandatory",
        linkedinLink: "mandatory",
        dateOfBirth: "mandatory",
      },
    },
    mode: "onChange",
  });

  // Load existing job data when editing
  useEffect(() => {
    if (jobId && jobData?.job) {
      const job = jobData.job;
      form.reset({
        jobName: job.jobName,
        jobType: job.jobType,
        jobDescription: job.jobDescription,
        numberOfCandidatesNeeded: job.numberOfCandidatesNeeded || undefined,
        minimumSalary: job.minimumSalary
          ? formatMoneyInput(job.minimumSalary.toString())
          : null,
        maximumSalary: job.maximumSalary
          ? formatMoneyInput(job.maximumSalary.toString())
          : null,
        location: job.location,
        minimumProfileInformation: job.minimumProfileInformation,
      });
      setIsActive(job.status === "active");
    }
  }, [jobId, jobData, form]);

  const onSubmit = async (data: FormJobOpeningData) => {
    // Convert salary strings to numbers
    const processedData = {
      jobName: data.jobName,
      jobType: data.jobType,
      jobDescription: data.jobDescription,
      numberOfCandidatesNeeded: data.numberOfCandidatesNeeded || null,
      minimumSalary: data.minimumSalary
        ? Number(data.minimumSalary.replace(/\D/g, ""))
        : null,
      maximumSalary: data.maximumSalary
        ? Number(data.maximumSalary.replace(/\D/g, ""))
        : null,
      location: data.location,
      minimumProfileInformation: data.minimumProfileInformation,
      status: isActive ? "active" : "inactive",
    };

    try {
      if (jobId) {
        // Update existing job
        await updateJobMutation.mutateAsync({
          id: jobId,
          data: processedData,
        });
      } else {
        // Create new job
        await createJobMutation.mutateAsync(processedData);
      }

      form.reset();
      onFinish?.();
    } catch (error) {
      // Error is already handled in mutation
      console.error("Form submission error:", error);
    }
  };

  const handleSaveDraft = async () => {
    const data = form.getValues();

    // must have job name
    if (!data.jobName || data.jobName.trim() === "") {
      toast.error("Job name is required to save as draft");
      return;
    }

    const processedData = {
      jobName: data.jobName,
      jobType: data.jobType,
      jobDescription: data.jobDescription,
      numberOfCandidatesNeeded: data.numberOfCandidatesNeeded || null,
      minimumSalary: data.minimumSalary
        ? Number(data.minimumSalary.replace(/\D/g, ""))
        : null,
      maximumSalary: data.maximumSalary
        ? Number(data.maximumSalary.replace(/\D/g, ""))
        : null,
      location: data.location,
      minimumProfileInformation: data.minimumProfileInformation,
      status: "draft",
    };

    try {
      if (jobId) {
        await updateJobMutation.mutateAsync({
          id: jobId,
          data: processedData,
        });
      } else {
        await createJobMutation.mutateAsync(processedData);
      }

      toast.success("Job vacancy saved as draft");
      onFinish?.();
    } catch (error) {
      // Error is already handled in mutation
      console.error("Save draft error:", error);
    }
  };

  // Show loading state when fetching job data
  if (isLoadingJob) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const isLoading = createJobMutation.isPending || updateJobMutation.isPending;

  return (
    <div className="w-full overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Name */}
          <div className="flex max-h-[calc(100vh-13rem)] flex-col gap-4 overflow-y-auto px-6">
            <FormInput
              form={form}
              name="jobName"
              label="Job Name*"
              placeholder="Ex. Front End Engineer"
            />

            {/* Job Type */}
            <FormDropDown
              form={form}
              name="jobType"
              label="Job Type*"
              placeholder="Select job type"
              options={jobTypeOptions}
              searchable={false}
            />

            {/* Job Description */}
            <FormInput
              form={form}
              name="jobDescription"
              label="Job Description*"
              placeholder="Ex."
              type="textarea"
            />

            {/* Number of Candidates Needed */}
            <FormInput
              form={form}
              name="numberOfCandidatesNeeded"
              label="Number of Candidate Needed*"
              placeholder="Ex. 2"
              type="number"
            />

            {/* Location */}
            <FormDropDown
              form={form}
              name="location"
              label="Location*"
              placeholder="Choose your location"
              options={indonesianCities}
              typeToSearch={true}
              searchable={false}
            />

            {/* Job Salary */}
            <div
              className="mt-2 space-y-4 pt-6"
              style={{
                borderTop: "1px dashed #E0E0E0",
                borderImage:
                  "repeating-linear-gradient(to right, #E0E0E0 0, #E0E0E0 10px, transparent 10px, transparent 20px) 1",
              }}
            >
              <p className="text-sm font-normal text-gray-700">Job Salary</p>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="minimumSalary"
                  label="Minimum Estimated Salary"
                  placeholder="7.000.000"
                  type="money"
                  additionalInfo="Rp"
                  maxLength={12}
                />
                <FormInput
                  form={form}
                  name="maximumSalary"
                  label="Maximum Estimated Salary"
                  placeholder="8.000.000"
                  type="money"
                  additionalInfo="Rp"
                  maxLength={12}
                />
              </div>
            </div>

            {/* Minimum Profile Information Required */}
            <div className="border-border-secondary flex flex-col gap-4 space-y-4 rounded-xl border p-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Minimum Profile Information Required
              </h3>

              <div className="p-2">
                {profileInfo.map(profile => (
                  <FormProfileRequirement
                    key={profile.value}
                    form={form}
                    name={
                      `minimumProfileInformation.${profile.value}` as keyof FormJobOpeningData
                    }
                    label={profile.label}
                    allowedOptions={
                      profile.option as ("mandatory" | "optional" | "off")[]
                    }
                    className="border-border-secondary border-b py-4 last:border-b-0 last:pb-0"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 px-6 pt-4">
            {/* Toggle Switch */}
            <div className="flex items-center justify-between gap-2.5">
              <Label htmlFor="job-status" className="text-sm font-medium">
                {isActive ? "Active" : "Inactive"}
              </Label>
              <Switch
                id="job-status"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-lg px-6 py-2.5 text-sm font-semibold"
              onClick={handleSaveDraft}
              disabled={isLoading}
            >
              <SaveIcon className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || isLoading}
              className="bg-secondary hover:bg-secondary-hover rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingSpinner showText={false} size="sm" className="w-10" />
              ) : (
                "Publish Job"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
