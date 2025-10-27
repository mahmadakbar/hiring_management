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

import { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Textarea } from "@components/atoms/textarea";

type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "textarea";

interface FormInputProps<T extends FieldValues> {
  readonly form: {
    readonly control: Control<T>;
  };
  readonly name: FieldPath<T>;
  readonly label?: string;
  readonly placeholder: string;
  readonly type?: InputType;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly hasForgottenPassword?: boolean;
  readonly classNameLabel?: string;
  readonly additionalInfo?: string;
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
                  <Input
                    className={cn(
                      "w-2/12 rounded-r-none bg-white placeholder:font-normal",
                      error && "border-destructive"
                    )}
                    value={additionalInfo}
                  />
                )}
                {type === "textarea" ? (
                  <Textarea
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                      `placeholder:font-normal} bg-white`,
                      additionalInfo ? "rounded-l-none border-l-0" : "",
                      error && "border-destructive",
                      className
                    )}
                    {...field}
                    onChange={e => field.onChange(e.target.value)}
                    rows={4}
                  />
                ) : (
                  <Input
                    type={inputType}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                      `bg-white placeholder:font-normal ${type === "number" ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" : ""}`,
                      additionalInfo ? "rounded-l-none border-l-0" : "",
                      error && "border-destructive",
                      className
                    )}
                    {...field}
                    onChange={e => {
                      // Handle number type conversion
                      if (type === "number") {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      } else {
                        field.onChange(e.target.value);
                      }
                    }}
                    onKeyDown={e => {
                      // Only allow numbers, backspace, delete, tab, escape, enter, and arrow keys for number inputs
                      if (type === "number") {
                        const target = e.target as HTMLInputElement;
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            e.key === "Backspace" ||
                            e.key === "Delete" ||
                            e.key === "Tab" ||
                            e.key === "Escape" ||
                            e.key === "Enter" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "ArrowUp" ||
                            e.key === "ArrowDown" ||
                            (e.key === "." && !target.value.includes(".")) ||
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
