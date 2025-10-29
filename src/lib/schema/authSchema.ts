import {
  MAIL_REGEX,
  PASSWORD_UPPERCASE_REGEX,
  PASSWORD_LOWERCASE_REGEX,
  PASSWORD_NUMBER_REGEX,
  PASSWORD_SPECIAL_CHAR_REGEX,
} from "@utils";
import z from "zod";
import { AUTH_MESSAGES } from "@enums/authEnum";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: AUTH_MESSAGES.EMAIL_REQUIRED })
    .refine(value => MAIL_REGEX.test(value), {
      message: AUTH_MESSAGES.EMAIL_INVALID,
    }),
  password: z
    .string()
    .min(1, {
      message: AUTH_MESSAGES.EMAIL_REQUIRED,
    })
    .optional(),
});

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: AUTH_MESSAGES.EMAIL_REQUIRED })
      .refine(value => MAIL_REGEX.test(value), {
        message: AUTH_MESSAGES.EMAIL_INVALID,
      }),
    name: z.string().min(1, { message: AUTH_MESSAGES.NAME_REQUIRED }),
    password: z
      .string()
      .min(8, {
        message: AUTH_MESSAGES.PASSWORD_MIN_LENGTH,
      })
      .refine(value => PASSWORD_UPPERCASE_REGEX.test(value), {
        message: AUTH_MESSAGES.PASSWORD_UPPERCASE,
      })
      .refine(value => PASSWORD_LOWERCASE_REGEX.test(value), {
        message: AUTH_MESSAGES.PASSWORD_LOWERCASE,
      })
      .refine(value => PASSWORD_NUMBER_REGEX.test(value), {
        message: AUTH_MESSAGES.PASSWORD_NUMBER,
      })
      .refine(value => PASSWORD_SPECIAL_CHAR_REGEX.test(value), {
        message: AUTH_MESSAGES.PASSWORD_SPECIAL_CHAR,
      }),
    confirmPassword: z.string().min(8, {
      message: AUTH_MESSAGES.CONFIRM_PASSWORD_MIN_LENGTH,
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: AUTH_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmPassword"], // This makes the error appear on the confirmPassword field
  });

export { loginSchema, registerSchema };
