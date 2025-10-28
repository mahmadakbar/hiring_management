"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormJobApplicationData } from "@interfaces/forms";
import jobApplicationSchema from "@lib/schema/jobApplicationSchema";
import React from "react";
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
import { genderOptions, indonesianCities, countryCodes } from "@utils";
import { Icon } from "@iconify/react";

export default function FormApplyJob() {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormJobApplicationData>({
    resolver: zodResolver(jobApplicationSchema) as any,
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

  const onSubmit = (data: FormJobApplicationData) => {
    setLoading(true);

    console.log("Application submitted:", data);

    setTimeout(() => {
      form.reset();
      setLoading(false);
      toast.success("Application successfully submitted");
    }, 1000);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[calc(100vh-15.5rem)] space-y-4 overflow-y-auto border border-t-0 px-10 py-7">
            <p className="text-destructive text-xs font-bold">* Required</p>
            {/* Photo Profile */}
            <FormPhotoUpload
              form={form}
              name="photoProfile"
              label="Photo Profile"
              fromFile="camera"
              withGesture={true}
            />

            {/* Full Name */}
            <FormInput
              form={form}
              name="fullName"
              label="Full name*"
              placeholder="Enter your full name"
            />

            {/* Date of Birth */}
            <FormCalendar
              form={form}
              name="dateOfBirth"
              label="Date of birth*"
              placeholder="Select date of birth"
              fromDate={new Date(1960, 0, 1)}
              startYear={1960}
              endYear={2025}
              dateFormat={"dd MMMM yyyy"}
            />

            {/* Gender (Pronoun) */}
            <FormRadioGroup
              form={form}
              name="gender"
              label="Pronoun (gender)*"
              options={genderOptions}
              orientation="horizontal"
            />

            {/* Domicile */}
            <FormDropDown
              form={form}
              name="domicile"
              label="Domicile*"
              placeholder="Choose your domicile"
              options={indonesianCities}
              typeToSearch={true}
              searchable={false}
            />

            {/* Phone Number */}
            <div className="flex">
              <FormDropDown
                form={form}
                name="phoneNumber.countryCode"
                label="Phone Number*"
                placeholder="Choose your country code"
                options={countryCodes}
                iconLabel={true}
                customOptions={option => (
                  <div className="ext-xs flex w-full items-center justify-between gap-2">
                    <div className="flex w-full items-center gap-2">
                      <Icon icon={option.icon as string} className="h-5 w-5" />
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

            {/* Email */}
            <FormInput
              form={form}
              name="email"
              label="Email*"
              placeholder="Enter your email address"
              type="email"
            />

            {/* LinkedIn Link */}
            <FormInput
              form={form}
              name="linkedinLink"
              label="Link Linkedin*"
              placeholder="https://linkedin.com/in/username"
              type="url"
            />
          </div>

          {/* Submit Button */}
          <div className="border-t-border flex w-full gap-4 px-10 pt-4">
            <Button
              type="submit"
              disabled={!form.formState.isValid || loading}
              className="bg-secondary hover:bg-secondary-hover w-full rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
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
