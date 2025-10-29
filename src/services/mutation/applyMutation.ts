import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@components/atoms/sonner";
import { apiApplyJob, ApplyJobData } from "@services/api/apply";

export const useApplyJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationData: ApplyJobData) => apiApplyJob(applicationData),
    onSuccess: data => {
      // Invalidate applications list if it exists
      queryClient.invalidateQueries({ queryKey: ["userApplications"] });
      toast.success(data.message || "Application submitted successfully");
    },
    onError: (error: any) => {
      console.error("Apply job error:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to submit application";
      toast.error(errorMessage);
    },
  });
};
