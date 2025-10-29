import { useQuery } from "@tanstack/react-query";
import { apiGetJobs, apiGetJobById, GetJobsParams } from "@services/api/jobs";
import { apiGetUserApplications } from "@services/api/apply";
import { IJobPosting } from "@interfaces/jobs";

interface GetJobsResponse {
  jobs: IJobPosting[];
}

interface GetJobByIdResponse {
  job: IJobPosting;
}

export const useGetJobs = (params?: GetJobsParams) => {
  return useQuery<GetJobsResponse>({
    queryKey: ["jobs", params],
    queryFn: () => apiGetJobs(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useGetJobById = (id: string, enabled: boolean = true) => {
  return useQuery<GetJobByIdResponse>({
    queryKey: ["job", id],
    queryFn: () => apiGetJobById(id),
    enabled: enabled && !!id, // Only run query if id exists and enabled is true
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCheckUserApplication = (
  jobId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["userApplication", jobId],
    queryFn: async () => {
      try {
        const response = await apiGetUserApplications(jobId);
        return {
          hasApplied: response.applications && response.applications.length > 0,
          applications: response.applications || [],
        };
      } catch (error: any) {
        // If unauthorized (401), user is not logged in - they haven't applied
        if (error?.response?.status === 401) {
          return { hasApplied: false, applications: [] };
        }
        throw error;
      }
    },
    enabled: enabled && !!jobId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
