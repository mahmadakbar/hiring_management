import z from "zod";

// Schema for job application form
const jobApplicationSchema = z.object({
  photoProfile: z
    .instanceof(File, {
      message: "Photo profile is required",
    })
    .refine(file => file.size > 0, {
      message: "Photo profile is required",
    })
    .refine(file => file.size <= 5 * 1024 * 1024, {
      message: "Photo must be less than 5MB",
    })
    .refine(
      file => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      {
        message: "Only .jpg, .jpeg, and .png formats are supported",
      }
    ),

  fullName: z
    .string()
    .min(1, { message: "Full name is required" })
    .min(3, { message: "Full name must be at least 3 characters" })
    .max(100, { message: "Full name must not exceed 100 characters" }),

  dateOfBirth: z
    .date({
      message: "Date of birth is required",
    })
    .refine(
      date => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 17 && age <= 65;
      },
      {
        message: "Age must be between 17 and 65 years old",
      }
    ),

  gender: z.enum(["female", "male"], {
    message: "Gender is required",
  }),

  domicile: z.string().min(1, { message: "Domicile is required" }),

  phoneNumber: z.object({
    countryCode: z.string().min(1).default("+62"),
    number: z
      .string()
      .min(1, { message: "Phone number is required" })
      .min(8, { message: "Phone number must be at least 8 digits" })
      .max(15, { message: "Phone number must not exceed 15 digits" })
      .regex(/^[0-9]+$/, {
        message: "Phone number must contain only numbers",
      }),
  }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),

  linkedinLink: z
    .string()
    .min(1, { message: "LinkedIn link is required" })
    .url({ message: "Please enter a valid URL" })
    .refine(
      url => {
        return url.includes("linkedin.com/in/");
      },
      {
        message:
          "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)",
      }
    ),
});

export default jobApplicationSchema;
