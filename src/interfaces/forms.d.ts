import z from "zod";
import { loginSchema, registerSchema } from "@lib/schema/authSchema";
import jobOpeningSchema from "@lib/schema/jobFormSchema";

type FormLoginData = z.infer<typeof loginSchema>;
type FormRegisterData = z.infer<typeof registerSchema>;
type FormJobOpeningData = z.infer<typeof jobOpeningSchema>;

export { FormLoginData, FormRegisterData, FormJobOpeningData };
