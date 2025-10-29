"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormJobApplicationData } from "@interfaces/forms";
import jobApplicationSchema from "@lib/schema/jobApplicationSchema";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@components/atoms/form";
import {
  FormInput,
  FormCalendar,
  FormDropDown,
  FormRadioGroup,
  FormPhotoUpload,
} from "@components/molecules/Form";
import { Button } from "@components/atoms/button";
import LoadingSpinner from "@components/atoms/loading";
import { toast } from "@components/atoms/sonner";
import {
  genderOptions,
  indonesianCities,
  countryCodes,
  fileToBase64,
} from "@utils";
import { Icon } from "@iconify/react";
import { useApplyJob } from "@services/mutation/applyMutation";
import { useRouter } from "next/navigation";
import { IJobPosting, TProfileInfoOption } from "@interfaces/jobs";
import z from "zod";

interface FormApplyJobProps {
  jobId: string;
  mandatoryFields: IJobPosting["minimumProfileInformation"];
}

// Helper function to create dynamic schema based on mandatory fields
const createDynamicSchema = (
  mandatoryFields: IJobPosting["minimumProfileInformation"]
) => {
  const baseSchema = jobApplicationSchema.shape;
  const dynamicSchemaFields: any = {};

  // Helper to make field optional
  const makeOptional = (schema: z.ZodTypeAny) => schema.optional();

  // Photo Profile
  if (mandatoryFields.photoProfile === "off") {
    // Skip this field entirely
  } else if (mandatoryFields.photoProfile === "optional") {
    dynamicSchemaFields.photoProfile = makeOptional(baseSchema.photoProfile);
  } else {
    dynamicSchemaFields.photoProfile = baseSchema.photoProfile;
  }

  // Full Name
  if (mandatoryFields.fullName === "off") {
    // Skip this field entirely
  } else if (mandatoryFields.fullName === "optional") {
    dynamicSchemaFields.fullName = z.string().optional();
  } else {
    dynamicSchemaFields.fullName = baseSchema.fullName;
  }

  // Date of Birth
  if (mandatoryFields.dateOfBirth === "off") {
    // Skip this field entirely
  } else if (mandatoryFields.dateOfBirth === "optional") {
    dynamicSchemaFields.dateOfBirth = z.date().optional();
  } else {
    dynamicSchemaFields.dateOfBirth = baseSchema.dateOfBirth;
  }

  // Gender
  if (mandatoryFields.gender === "off") {
    // Skip this field entirely
  } else if (mandatoryFields.gender === "optional") {
    dynamicSchemaFields.gender = z.enum(["female", "male"]).optional();
  } else {
    dynamicSchemaFields.gender = baseSchema.gender;
  }

  // Domicile
  if (mandatoryFields.domicile === "off") {
    // Skip this field entirely
  } else if (mandatoryFields.domicile === "optional") {
    dynamicSchemaFields.domicile = z.string().optional();
  } else {
    dynamicSchemaFields.domicile = baseSchema.domicile;
  }

  // Phone Number
  if (mandatoryFields.phoneNumber === "off") {
    // Skip this field entirely
  } else if (mandatoryFields.phoneNumber === "optional") {
    dynamicSchemaFields.phoneNumber = z
      .object({
        countryCode: z.string().optional(),
        number: z.string().optional(),
      })
      .optional();
  } else {
    dynamicSchemaFields.phoneNumber = baseSchema.phoneNumber;
  }

  // Email
  if (mandatoryFields.email === "off") {
    // Skip this field entirely
  } else if (mandatoryFields.email === "optional") {
    dynamicSchemaFields.email = z.string().email().optional().or(z.literal(""));
  } else {
    dynamicSchemaFields.email = baseSchema.email;
  }

  // LinkedIn Link
  if (mandatoryFields.linkedinLink === "off") {
    // Skip this field entirely
  } else if (mandatoryFields.linkedinLink === "optional") {
    dynamicSchemaFields.linkedinLink = z
      .string()
      .url()
      .optional()
      .or(z.literal(""));
  } else {
    dynamicSchemaFields.linkedinLink = baseSchema.linkedinLink;
  }

  return z.object(dynamicSchemaFields);
};

// Helper function to check if field should be shown
const isFieldVisible = (fieldStatus: TProfileInfoOption) => {
  return fieldStatus !== "off";
};

// Helper function to check if field is required
const isFieldRequired = (fieldStatus: TProfileInfoOption) => {
  return fieldStatus === "mandatory";
};

export default function FormApplyJob({
  jobId,
  mandatoryFields,
}: FormApplyJobProps) {
  const router = useRouter();
  const applyJobMutation = useApplyJob();

  console.log("Mandatory Fields:", mandatoryFields);

  // Create dynamic schema based on mandatory fields
  const dynamicSchema = useMemo(
    () => createDynamicSchema(mandatoryFields),
    [mandatoryFields]
  );

  const form = useForm<FormJobApplicationData>({
    resolver: zodResolver(dynamicSchema) as any,
    defaultValues: {
      photoProfile: undefined,
      fullName: "",
      dateOfBirth: undefined,
      gender: undefined,
      domicile: "",
      phoneNumber: {
        countryCode: "+62",
        number: "",
      },
      email: "",
      linkedinLink: "",
    },
    mode: "onChange",
  });

  const countryCode = form.watch("phoneNumber.countryCode");

  const onSubmit = async (data: FormJobApplicationData) => {
    try {
      // Validate photo profile exists and is a File (only if mandatory or optional)
      if (
        isFieldVisible(mandatoryFields.photoProfile) &&
        isFieldRequired(mandatoryFields.photoProfile)
      ) {
        if (!data.photoProfile || !(data.photoProfile instanceof File)) {
          toast.error("Photo profile is required. Please upload a photo.");
          return;
        }
      }

      // Convert photo to base64 if it exists
      let photoBase64 = null;
      if (data.photoProfile && data.photoProfile instanceof File) {
        photoBase64 = await fileToBase64(data.photoProfile);
      }

      // Prepare the application data - only include visible fields
      const applicationData: any = {
        jobId,
      };

      if (isFieldVisible(mandatoryFields.photoProfile) && photoBase64) {
        applicationData.photoProfile = photoBase64;
      }

      if (isFieldVisible(mandatoryFields.fullName) && data.fullName) {
        applicationData.fullName = data.fullName;
      }

      if (isFieldVisible(mandatoryFields.dateOfBirth) && data.dateOfBirth) {
        applicationData.dateOfBirth = data.dateOfBirth;
      }

      if (isFieldVisible(mandatoryFields.gender) && data.gender) {
        applicationData.gender = data.gender;
      }

      if (isFieldVisible(mandatoryFields.domicile) && data.domicile) {
        applicationData.domicile = data.domicile;
      }

      if (isFieldVisible(mandatoryFields.phoneNumber) && data.phoneNumber) {
        applicationData.phoneNumber = {
          countryCode: data.phoneNumber.countryCode,
          number: data.phoneNumber.number,
        };
      }

      if (isFieldVisible(mandatoryFields.email) && data.email) {
        applicationData.email = data.email;
      }

      if (isFieldVisible(mandatoryFields.linkedinLink) && data.linkedinLink) {
        applicationData.linkedinLink = data.linkedinLink;
      }

      // Submit application
      await applyJobMutation.mutateAsync(applicationData);

      // Reset form and redirect on success
      form.reset();

      // Redirect to job list after successful submission
      setTimeout(() => {
        router.push("/job-list");
      }, 1500);
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Application submission error:", error);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[calc(100vh-15.5rem)] space-y-4 overflow-y-auto border border-t-0 px-10 py-7">
            <p className="text-destructive text-xs font-bold">* Required</p>

            {/* Photo Profile */}
            {isFieldVisible(mandatoryFields.photoProfile) && (
              <FormPhotoUpload
                form={form}
                name="photoProfile"
                label={`Photo Profile${isFieldRequired(mandatoryFields.photoProfile) ? "*" : ""}`}
                fromFile="camera"
                withGesture={true}
              />
            )}

            {/* Full Name */}
            {isFieldVisible(mandatoryFields.fullName) && (
              <FormInput
                form={form}
                name="fullName"
                label={`Full name${isFieldRequired(mandatoryFields.fullName) ? "*" : ""}`}
                placeholder="Enter your full name"
              />
            )}

            {/* Date of Birth */}
            {isFieldVisible(mandatoryFields.dateOfBirth) && (
              <FormCalendar
                form={form}
                name="dateOfBirth"
                label={`Date of birth${isFieldRequired(mandatoryFields.dateOfBirth) ? "*" : ""}`}
                placeholder="Select date of birth"
                fromDate={new Date(1960, 0, 1)}
                startYear={1960}
                endYear={2025}
                dateFormat={"dd MMMM yyyy"}
              />
            )}

            {/* Gender (Pronoun) */}
            {isFieldVisible(mandatoryFields.gender) && (
              <FormRadioGroup
                form={form}
                name="gender"
                label={`Pronoun (gender)${isFieldRequired(mandatoryFields.gender) ? "*" : ""}`}
                options={genderOptions}
                orientation="horizontal"
              />
            )}

            {/* Domicile */}
            {isFieldVisible(mandatoryFields.domicile) && (
              <FormDropDown
                form={form}
                name="domicile"
                label={`Domicile${isFieldRequired(mandatoryFields.domicile) ? "*" : ""}`}
                placeholder="Choose your domicile"
                options={indonesianCities}
                typeToSearch={true}
                searchable={false}
              />
            )}

            {/* Phone Number */}
            {isFieldVisible(mandatoryFields.phoneNumber) && (
              <div className="flex">
                <FormDropDown
                  form={form}
                  name="phoneNumber.countryCode"
                  label={`Phone Number${isFieldRequired(mandatoryFields.phoneNumber) ? "*" : ""}`}
                  placeholder="Choose your country code"
                  options={countryCodes}
                  iconLabel={true}
                  customOptions={option => (
                    <div className="ext-xs flex w-full items-center justify-between gap-2">
                      <div className="flex w-full items-center gap-2">
                        <Icon
                          icon={option.icon as string}
                          className="h-5 w-5"
                        />
                        <span>{option.label}</span>
                      </div>
                      <span className="text-xs">{option.value}</span>
                    </div>
                  )}
                  stylePopoverContent={{ width: "400px" }}
                  className="rounded-r-none border-r-0"
                />

                <div className="flex h-10 items-center self-end border-t-2 border-b-2 py-1.5">
                  <div className="h-full border-r" />
                </div>

                <div className="flex flex-1 flex-col gap-1 self-end">
                  <FormInput
                    form={form}
                    name="phoneNumber.number"
                    additionalInfo={countryCode}
                    classNameInfo="text-sm font-normal"
                    className="rounded-l-none border-l-0 pl-12"
                    type="tel"
                    placeholder="81XXXXXXXXX"
                    maxLength={15}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            {isFieldVisible(mandatoryFields.email) && (
              <FormInput
                form={form}
                name="email"
                label={`Email${isFieldRequired(mandatoryFields.email) ? "*" : ""}`}
                placeholder="Enter your email address"
                type="email"
              />
            )}

            {/* LinkedIn Link */}
            {isFieldVisible(mandatoryFields.linkedinLink) && (
              <FormInput
                form={form}
                name="linkedinLink"
                label={`Link Linkedin${isFieldRequired(mandatoryFields.linkedinLink) ? "*" : ""}`}
                placeholder="https://linkedin.com/in/username"
                type="url"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="border-t-border flex w-full gap-4 px-10 pt-4">
            <Button
              type="submit"
              disabled={!form.formState.isValid || applyJobMutation.isPending}
              className="bg-secondary hover:bg-secondary-hover w-full rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applyJobMutation.isPending ? (
                <LoadingSpinner showText={false} size="sm" className="w-10" />
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
