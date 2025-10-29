import axios from "axios";

export interface ApplyJobData {
  jobId: string;
  photoProfile?: string; // Base64 string
  fullName: string;
  dateOfBirth?: Date;
  gender?: string;
  domicile?: string;
  phoneNumber: {
    countryCode: string;
    number: string;
  };
  email: string;
  linkedinLink?: string;
}

export interface UserApplication {
  id: number;
  userId: string;
  jobId: string;
  photoProfile?: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  domicile?: string;
  phoneNumber?: string;
  countryCode: string;
  email: string;
  linkedinLink?: string;
  createdAt: string;
}

export const apiApplyJob = async (applicationData: ApplyJobData) => {
  const response = await axios.post("/api/apply", applicationData);
  return response.data;
};

export const apiGetUserApplications = async (jobId?: string) => {
  const url = jobId ? `/api/apply?jobId=${jobId}` : "/api/apply";
  const response = await axios.get(url);
  return response.data;
};

export const apiGetJobApplicants = async (jobId: string) => {
  const response = await axios.get(`/api/apply/applicants?jobId=${jobId}`);
  return response.data;
};
