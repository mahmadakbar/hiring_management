import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@components/atoms/sonner";
import {
  apiCreateJob,
  apiUpdateJob,
  apiDeleteJob,
  CreateJobData,
  UpdateJobData,
} from "@services/api/jobs";

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobData: CreateJobData) => apiCreateJob(jobData),
    onSuccess: data => {
      // Invalidate and refetch jobs list
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(data.message || "Job created successfully");
    },
    onError: (error: any) => {
      console.error("Create job error:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create job";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobData }) =>
      apiUpdateJob(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch jobs list
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      // Invalidate specific job query
      queryClient.invalidateQueries({ queryKey: ["job", variables.id] });
      toast.success(data.message || "Job updated successfully");
    },
    onError: (error: any) => {
      console.error("Update job error:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update job";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDeleteJob(id),
    onSuccess: (data, id) => {
      // Invalidate and refetch jobs list
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      // Remove specific job from cache
      queryClient.removeQueries({ queryKey: ["job", id] });
      toast.success(data.message || "Job deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete job error:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to delete job";
      toast.error(errorMessage);
    },
  });
};
