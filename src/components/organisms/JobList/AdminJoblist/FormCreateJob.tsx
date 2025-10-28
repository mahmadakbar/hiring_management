import { zodResolver } from "@hookform/resolvers/zod";
import { FormJobOpeningData } from "@interfaces/forms";
import jobOpeningSchema from "@lib/schema/jobFormSchema";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Form } from "@components/atoms/form";
import {
  FormInput,
  FormDropDown,
  FormProfileRequirement,
} from "@components/molecules/Form";
import { Button } from "@components/atoms/button";
import { jobTypeOptions, profileInfo } from "./listData";
import { useJobListStore } from "@stores/jobListStore";
import LoadingSpinner from "@components/atoms/loading";
import { toast } from "@components/atoms/sonner";
import { SaveIcon } from "lucide-react";

type FormCreateJobProps = Readonly<{
  onFinish?: () => void;
}>;

export default function FormCreateJob({ onFinish }: FormCreateJobProps) {
  const { addJob } = useJobListStore();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormJobOpeningData>({
    resolver: zodResolver(jobOpeningSchema) as any,
    defaultValues: {
      jobName: "",
      jobType: "",
      jobDescription: "",
      numberOfCandidatesNeeded: undefined,
      minimumSalary: null,
      maximumSalary: null,
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

  const onSubmit = (data: FormJobOpeningData) => {
    setLoading(true);
    addJob(data);

    console.log("Job successfully published with status: active", data);

    setTimeout(() => {
      form.reset();
      onFinish?.();
      setLoading(false);
      toast.success("Job vacancy successfully created");
    }, 1000);
  };

  const handleSaveDraft = () => {
    const data = form.getValues();

    // must have job name
    if (!data.jobName || data.jobName.trim() === "") {
      toast.error("Job name is required to save as draft");
      return;
    }

    addJob(data, "draft");
    toast.success("Job vacancy saved as draft");
    onFinish?.();
  };

  return (
    <div className="max-h-[calc(100vh-10rem)] w-full overflow-y-auto px-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Name */}
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

          {/* Job Salary */}
          <div
            className="space-y-4 pt-6"
            style={{
              borderTop: "1px dashed #d1d5db",
              borderImage:
                "repeating-linear-gradient(to right, #d1d5db 0, #d1d5db 10px, transparent 10px, transparent 20px) 1",
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

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              className="mr-4 rounded-lg px-6 py-2.5 text-sm font-semibold"
              onClick={handleSaveDraft}
              disabled={loading}
            >
              <SaveIcon className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || loading}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold"
            >
              {loading ? (
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
