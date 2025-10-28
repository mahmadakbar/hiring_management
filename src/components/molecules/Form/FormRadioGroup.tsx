import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/atoms/form";
import { RadioGroup, RadioGroupItem } from "@components/atoms/radio-group";
import { Label } from "@components/atoms/label";
import { cn } from "@utils";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface RadioOption {
  value: string;
  label: string;
}

interface FormRadioGroupProps<T extends FieldValues> {
  form: {
    control: Control<T>;
  };
  name: FieldPath<T>;
  label?: string;
  options: RadioOption[];
  disabled?: boolean;
  className?: string;
  classNameLabel?: string;
  orientation?: "horizontal" | "vertical";
}

export default function FormRadioGroup<T extends FieldValues>({
  form,
  name,
  label,
  options,
  disabled = false,
  className,
  classNameLabel,
  orientation = "horizontal",
}: Readonly<FormRadioGroupProps<T>>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-3", className)}>
          {label && (
            <FormLabel className={cn("text-sm font-medium", classNameLabel)}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
              className={cn(
                orientation === "horizontal"
                  ? "flex flex-row gap-6"
                  : "flex flex-col space-y-2"
              )}
            >
              {options.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${name}-${option.value}`}
                  />
                  <Label
                    htmlFor={`${name}-${option.value}`}
                    className="cursor-pointer text-sm font-normal text-gray-700"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
