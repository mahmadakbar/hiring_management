import { MAIL_REGEX } from "@utils";
import z from "zod";
import { AUTH_MESSAGES } from "@enums/authEnum";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: AUTH_MESSAGES.EMAIL_REQUIRED })
    .refine(value => MAIL_REGEX.test(value), {
      message: AUTH_MESSAGES.EMAIL_INVALID,
    }),
  password: z.string().min(6, {
    message: AUTH_MESSAGES.PASSWORD_MIN_LENGTH,
  }),
});

const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: AUTH_MESSAGES.EMAIL_REQUIRED })
    .refine(value => MAIL_REGEX.test(value), {
      message: AUTH_MESSAGES.EMAIL_INVALID,
    }),
});

export { loginSchema, registerSchema };
