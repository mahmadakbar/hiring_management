import z from "zod";
import { loginSchema, registerSchema } from "@lib/schema/authSchema";
import jobOpeningSchema from "@lib/schema/jobFormSchema";
import jobApplicationSchema from "@lib/schema/jobApplicationSchema";

type FormLoginData = z.infer<typeof loginSchema>;
type FormRegisterData = z.infer<typeof registerSchema>;
type FormJobOpeningData = z.infer<typeof jobOpeningSchema>;
type FormJobApplicationData = z.infer<typeof jobApplicationSchema>;

export {
  FormLoginData,
  FormRegisterData,
  FormJobOpeningData,
  FormJobApplicationData,
};
