import { Check, X } from "lucide-react";
import { cn } from "@utils";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

export default function PasswordRequirements({
  password,
  className,
}: PasswordRequirementsProps) {
  const requirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "One uppercase letter (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter (a-z)",
      met: /[a-z]/.test(password),
    },
    {
      label: "One number (0-9)",
      met: /\d/.test(password),
    },
    {
      label: "One special character (@$!%*?&#, etc.)",
      met: /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/.test(password),
    },
  ];

  // Don't show if password is empty
  if (!password) return null;

  return (
    <div
      className={cn(
        "rounded-md border border-gray-200 bg-gray-50 p-3",
        className
      )}
    >
      <p className="mb-2 text-xs font-semibold text-gray-700">
        Password Requirements:
      </p>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-gray-400" />
            )}
            <span
              className={cn(
                "transition-colors",
                req.met ? "font-medium text-green-600" : "text-gray-600"
              )}
            >
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
