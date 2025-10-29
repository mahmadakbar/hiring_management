export const MAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password must contain at least one uppercase, one lowercase, one number, and one special character
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]{8,}$/;

// Individual password component checks for more detailed error messages
export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
export const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
export const PASSWORD_NUMBER_REGEX = /\d/;
export const PASSWORD_SPECIAL_CHAR_REGEX =
  /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/;
