import axios from "axios";
import { IJobPosting } from "@interfaces/jobs";

export interface GetJobsParams {
  status?: string;
  search?: string;
}

export interface CreateJobData {
  jobName: string;
  jobType: string;
  jobDescription: string;
  numberOfCandidatesNeeded: number | null;
  minimumSalary: number | null;
  maximumSalary: number | null;
  location: string;
  minimumProfileInformation: any;
  status: string;
}

export interface UpdateJobData extends Partial<CreateJobData> {}

export const apiGetJobs = async (params?: GetJobsParams) => {
  const queryParams = new URLSearchParams();

  if (params?.status) {
    queryParams.append("status", params.status);
  }

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  const url = `/api/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await axios.get(url);
  return response.data;
};

export const apiGetJobById = async (id: string) => {
  const response = await axios.get(`/api/jobs/${id}`);
  return response.data;
};

export const apiCreateJob = async (jobData: CreateJobData) => {
  const response = await axios.post("/api/jobs", jobData);
  return response.data;
};

export const apiUpdateJob = async (id: string, jobData: UpdateJobData) => {
  const response = await axios.put(`/api/jobs/${id}`, jobData);
  return response.data;
};

export const apiDeleteJob = async (id: string) => {
  const response = await axios.delete(`/api/jobs/${id}`);
  return response.data;
};
