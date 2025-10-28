import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IJobPosting, TJobStatus } from "@interfaces/jobs";
import { FormJobOpeningData } from "@interfaces/forms";

interface JobListStore {
  jobs: IJobPosting[];
  addJob: (job: FormJobOpeningData, status?: TJobStatus) => void;
  updateJobStatus: (id: string, status: TJobStatus) => void;
  deleteJob: (id: string) => void;
  getJobById: (id: string) => IJobPosting | undefined;
}

export const useJobListStore = create<JobListStore>()(
  persist(
    (set, get) => ({
      jobs: [],

      addJob: (job: FormJobOpeningData, status?: TJobStatus) => {
        const newJob: IJobPosting = {
          ...job,
          id: crypto.randomUUID(),
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

      updateJobStatus: (id: string, status: TJobStatus) => {
        set(state => ({
          jobs: state.jobs.map(job =>
            job.id === id ? { ...job, status } : job
          ),
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
