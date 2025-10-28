import { Button } from "@components/atoms/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@components/atoms/form";
import { Input } from "@components/atoms/input";
import { cn } from "@utils";
import { Eye, EyeOff } from "lucide-react";
import { formatMoneyInput } from "@utils";

import { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Textarea } from "@components/atoms/textarea";

type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "money"
  | "tel"
  | "url"
  | "search"
  | "textarea";

interface FormInputProps<T extends FieldValues> {
  form: {
    control: Control<T>;
  };
  name: FieldPath<T>;
  label?: string;
  placeholder: string;
  type?: InputType;
  disabled?: boolean;
  className?: string;
  classNameLabel?: string;
  additionalInfo?: string;
  maxLength?: number;
  value?: string | number;
  classNameInfo?: string;
}

export default function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  className,
  classNameLabel,
  additionalInfo,
  maxLength,
  value,
  classNameInfo,
}: Readonly<FormInputProps<T>>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  const getInputType = () => {
    if (isPasswordType) {
      return showPassword ? "text" : "password";
    }
    return type;
  };

  const inputType = getInputType();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { error } = useFormField();

        return (
          <FormItem>
            {label && (
              <FormLabel
                className={cn(
                  "text-font-natural text-xs font-normal",
                  classNameLabel
                )}
              >
                {label}
              </FormLabel>
            )}
            <FormControl>
              <div className="relative flex">
                {additionalInfo && (
                  <span
                    className={cn(
                      "text-font-primary absolute left-4 flex h-full transform items-center text-sm font-bold",
                      classNameInfo
                    )}
                  >
                    {additionalInfo}
                  </span>
                )}
                {type === "textarea" ? (
                  <Textarea
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                      `placeholder:font-normal} bg-white`,
                      error && "border-destructive",
                      additionalInfo ? "pl-10" : "",
                      className
                    )}
                    {...field}
                    onChange={e => field.onChange(e.target.value)}
                    rows={4}
                    maxLength={maxLength}
                    value={value || field.value}
                  />
                ) : (
                  <Input
                    type={inputType === "money" ? "text" : inputType}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    className={cn(
                      `bg-white placeholder:font-normal ${type === "number" || type === "money" ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" : ""}`,
                      error && "border-destructive",
                      additionalInfo ? "pl-10" : "",
                      className
                    )}
                    {...field}
                    value={
                      type === "money" && field.value
                        ? `${formatMoneyInput(String(field.value).replace(/^Rp\s*/, ""))}`
                        : value || field.value
                    }
                    onChange={e => {
                      // Handle money type formatting
                      if (type === "money") {
                        const value = e.target.value.replace(/^Rp\s*/, ""); // Remove Rp prefix if present
                        const formattedValue = formatMoneyInput(value);
                        field.onChange(formattedValue);
                      }
                      // Handle number type conversion
                      else if (type === "number") {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }
                      // Handle tel type - prevent leading zero
                      else if (type === "tel") {
                        let value = e.target.value;
                        // Remove all leading zeros
                        value = value.replace(/^0+/, "");
                        field.onChange(value);
                      } else {
                        field.onChange(e.target.value);
                      }
                    }}
                    onKeyDown={e => {
                      // Allow money formatting keys for money and number inputs
                      if (
                        type === "money" ||
                        type === "number" ||
                        type === "tel"
                      ) {
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") || // Allow all digits 0-9
                            e.key === "Backspace" ||
                            e.key === "Delete" ||
                            e.key === "Tab" ||
                            e.key === "Escape" ||
                            e.key === "Enter" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "ArrowUp" ||
                            e.key === "ArrowDown" ||
                            (e.ctrlKey &&
                              (e.key === "a" ||
                                e.key === "c" ||
                                e.key === "v" ||
                                e.key === "x"))
                          )
                        ) {
                          e.preventDefault();
                        }
                      }
                    }}
                  />
                )}
                {isPasswordType && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform p-0 hover:bg-transparent focus:ring-0"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="text-font-primary h-6 w-6" />
                    ) : (
                      <Eye className="text-font-primary h-6 w-6" />
                    )}
                  </Button>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
