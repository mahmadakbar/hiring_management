export const AUTH_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email address.",
  NAME_REQUIRED: "Name is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters.",
  PASSWORD_UPPERCASE: "Password must contain at least one uppercase letter.",
  PASSWORD_LOWERCASE: "Password must contain at least one lowercase letter.",
  PASSWORD_NUMBER: "Password must contain at least one number.",
  PASSWORD_SPECIAL_CHAR:
    "Password must contain at least one special character (@$!%*?&#, etc.).",
  PASSWORD_REQUIREMENTS:
    "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.",
  CONFIRM_PASSWORD_MIN_LENGTH:
    "Confirm password must be at least 8 characters.",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match.",
} as const;
