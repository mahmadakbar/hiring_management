export interface IJobPosting {
  id: string;
  jobId: string;
  jobName: string;
  jobType: string;
  jobDescription: string;
  numberOfCandidatesNeeded: number | null;
  minimumSalary: number | null;
  maximumSalary: number | null;
  location: string;
  minimumProfileInformation: {
    fullName: TProfileInfoOption;
    photoProfile: TProfileInfoOption;
    gender: TProfileInfoOption;
    domicile: TProfileInfoOption;
    email: TProfileInfoOption;
    phoneNumber: TProfileInfoOption;
    linkedinLink: TProfileInfoOption;
    dateOfBirth: TProfileInfoOption;
  };
  createdAt: Date;
  status: TJobStatus;
}

export type TJobStatus = "active" | "inactive" | "draft";
export type TProfileInfoOption = "mandatory" | "optional" | "off";
