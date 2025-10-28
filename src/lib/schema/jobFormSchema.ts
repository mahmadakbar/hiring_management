import z from "zod";

// Enum for profile field requirements
const ProfileFieldRequirement = z.enum(["mandatory", "optional", "off"]);

// Schema for minimum profile information required
const minimumProfileSchema = z.object({
  fullName: ProfileFieldRequirement,
  photoProfile: ProfileFieldRequirement,
  gender: ProfileFieldRequirement,
  domicile: ProfileFieldRequirement,
  email: ProfileFieldRequirement,
  phoneNumber: ProfileFieldRequirement,
  linkedinLink: ProfileFieldRequirement,
  dateOfBirth: ProfileFieldRequirement,
});

// Main job opening schema
const jobOpeningSchema = z
  .object({
    jobName: z.string().min(1, { message: "Job name is required" }),
    jobType: z.string().min(1, { message: "Job type is required" }),
    jobDescription: z
      .string()
      .min(1, { message: "Job description is required" }),
    numberOfCandidatesNeeded: z.coerce
      .number()
      .positive({ message: "Must be at least 1" })
      .int({ message: "Must be a whole number" }),
    minimumSalary: z
      .union([
        z.string().min(1, { message: "Minimum salary must be provided" }),
        z.literal("").transform(() => null),
        z.null(),
      ])
      .optional(),
    maximumSalary: z
      .union([
        z.string().min(1, { message: "Maximum salary must be provided" }),
        z.literal("").transform(() => null),
        z.null(),
      ])
      .optional(),
    minimumProfileInformation: minimumProfileSchema,
  })
  .refine(
    data => {
      const minSalary = data?.minimumSalary
        ? parseFloat(data.minimumSalary)
        : 0;
      const maxSalary = data?.maximumSalary
        ? parseFloat(data.maximumSalary)
        : 0;

      // If both are not provided, validation passes
      if (!minSalary && !maxSalary) return true;

      // If only one is provided, validation passes
      if (!minSalary || !maxSalary) return true;

      // If both are provided, max must be >= min
      return maxSalary >= minSalary;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maximumSalary"],
    }
  );

export { minimumProfileSchema, ProfileFieldRequirement };
export default jobOpeningSchema;
