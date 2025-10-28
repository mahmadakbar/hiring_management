import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/atoms/form";
import { cn } from "@utils";
import { Control, FieldPath, FieldValues } from "react-hook-form";

type RequirementOption = "mandatory" | "optional" | "off";

interface FormProfileRequirementProps<T extends FieldValues> {
  form: {
    control: Control<T>;
  };
  name: FieldPath<T>;
  label: string;
  className?: string;
  allowedOptions?: RequirementOption[];
}

export default function FormProfileRequirement<T extends FieldValues>({
  form,
  name,
  label,
  className,
  allowedOptions = ["mandatory", "optional", "off"],
}: Readonly<FormProfileRequirementProps<T>>) {
  const allOptions: RequirementOption[] = ["mandatory", "optional", "off"];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm font-normal text-gray-700">
              {label}
            </FormLabel>
            <FormControl>
              <div className="flex gap-2">
                {allOptions.map(option => {
                  const isEnabled = allowedOptions.includes(option);
                  const isSelected = field.value === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => isEnabled && field.onChange(option)}
                      disabled={!isEnabled}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all duration-200",
                        isEnabled
                          ? isSelected
                            ? "text-secondary border-secondary border"
                            : "text-font-natural border"
                          : "bg-border-secondary text-border-grey cursor-not-allowed border"
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
}
