import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IJobPosting, TJobStatus } from "@interfaces/jobs";
import { FormJobOpeningData } from "@interfaces/forms";

interface JobListStore {
  jobs: IJobPosting[];
  addJob: (job: FormJobOpeningData, status?: TJobStatus) => void;
  updateJob: (
    id: string,
    data: Partial<FormJobOpeningData>,
    status?: TJobStatus
  ) => void;
  deleteJob: (id: string) => void;
  getJobById: (id: string) => IJobPosting | undefined;
}

export const useJobListStore = create<JobListStore>()(
  persist(
    (set, get) => ({
      jobs: [],

      addJob: (job: FormJobOpeningData, status?: TJobStatus) => {
        const id = crypto.randomUUID();
        const newJob: IJobPosting = {
          ...job,
          id,
          jobId: id,
          createdAt: new Date(),
          status: status || "active",
          minimumSalary: job.minimumSalary
            ? Number(job.minimumSalary.replace(/\D/g, ""))
            : null,
          maximumSalary: job.maximumSalary
            ? Number(job.maximumSalary.replace(/\D/g, ""))
            : null,
        };

        set(state => ({
          jobs: [...state.jobs, newJob],
        }));
      },

      updateJob: (
        id: string,
        data: Partial<FormJobOpeningData>,
        status?: TJobStatus
      ) => {
        set(state => ({
          jobs: state.jobs.map(job => {
            if (job.id === id) {
              // Create a copy of the data and process salary fields
              const { minimumSalary, maximumSalary, ...rest } = data;

              const updatedData: Partial<IJobPosting> = {
                ...rest,
              };

              // Convert minimumSalary from string to number if provided
              if (minimumSalary !== undefined) {
                updatedData.minimumSalary =
                  typeof minimumSalary === "string" && minimumSalary
                    ? Number(minimumSalary.replace(/\D/g, ""))
                    : null;
              }

              // Convert maximumSalary from string to number if provided
              if (maximumSalary !== undefined) {
                updatedData.maximumSalary =
                  typeof maximumSalary === "string" && maximumSalary
                    ? Number(maximumSalary.replace(/\D/g, ""))
                    : null;
              }

              return {
                ...job,
                ...updatedData,
                ...(status ? { status } : {}),
              };
            }
            return job;
          }),
        }));
      },

      deleteJob: (id: string) => {
        set(state => ({
          jobs: state.jobs.filter(job => job.id !== id),
        }));
      },

      getJobById: (id: string) => {
        return get().jobs.find(job => job.id === id);
      },
    }),
    {
      name: "job-list-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
