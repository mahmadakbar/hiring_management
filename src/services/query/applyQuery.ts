import { useQuery } from "@tanstack/react-query";
import {
  apiGetUserApplications,
  apiGetJobApplicants,
} from "@services/api/apply";

export const useGetUserApplications = (jobId?: string) => {
  return useQuery({
    queryKey: ["userApplications", jobId],
    queryFn: () => apiGetUserApplications(jobId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetJobApplicants = (jobId: string) => {
  return useQuery({
    queryKey: ["jobApplicants", jobId],
    queryFn: () => apiGetJobApplicants(jobId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!jobId, // Only run query if jobId is provided
  });
};
